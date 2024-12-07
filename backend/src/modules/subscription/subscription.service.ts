import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { User } from '../auth/entities/user.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { RestaurantService } from '../restaurant/restaurant.service';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    private restaurantService: RestaurantService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16'
    });
  }

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
    user: User,
  ) {
    const restaurant = await this.restaurantService.findOne(
      createSubscriptionDto.restaurantId,
      user
    );

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Criar ou recuperar cliente no Stripe
    let stripeCustomer: Stripe.Customer;
    
    if (restaurant.stripeCustomerId) {
      stripeCustomer = await this.stripe.customers.retrieve(
        restaurant.stripeCustomerId,
      ) as Stripe.Customer;
    } else {
      stripeCustomer = await this.stripe.customers.create({
        email: user.email,
        metadata: {
          restaurantId: restaurant.id,
          userId: user.id,
        },
      });

      restaurant.stripeCustomerId = stripeCustomer.id;
      await this.restaurantService.save(restaurant);
    }

    // Criar assinatura
    const subscription = await this.stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [{ price: createSubscriptionDto.priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    return this.handleSubscription(subscription);
  }

  async cancelSubscription(restaurantId: string, user: User) {
    const restaurant = await this.restaurantService.findOne(
      restaurantId,
      user
    );

    if (!restaurant || !restaurant.subscriptionId) {
      throw new NotFoundException('Subscription not found');
    }

    await this.stripe.subscriptions.cancel(restaurant.subscriptionId);

    await this.updateRestaurantSubscription(restaurant);

    return { message: 'Subscription canceled successfully' };
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const restaurant = await this.restaurantService.findByStripeCustomerId(
          subscription.customer as string
        );

        if (restaurant) {
          restaurant.subscriptionId = subscription.id;
          restaurant.subscriptionStatus = subscription.status;
          await this.restaurantService.save(restaurant);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const restaurant = await this.restaurantService.findByStripeCustomerId(
          subscription.customer as string
        );

        if (restaurant) {
          await this.updateRestaurantSubscription(restaurant);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const restaurant = await this.restaurantService.findByStripeCustomerId(
          invoice.customer as string
        );

        if (restaurant) {
          restaurant.subscriptionStatus = 'active';
          await this.restaurantService.save(restaurant);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const restaurant = await this.restaurantService.findByStripeCustomerId(
          invoice.customer as string
        );

        if (restaurant) {
          restaurant.subscriptionStatus = 'past_due';
          await this.restaurantService.save(restaurant);
        }
        break;
      }
    }

    return { received: true };
  }

  async getSubscriptionPlans() {
    const prices = await this.stripe.prices.list({
      active: true,
      type: 'recurring',
      expand: ['data.product'],
    });

    return prices.data.map(price => this.handlePrice(price));
  }

  async handleSubscription(subscription: Stripe.Subscription) {
    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
    
    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent?.client_secret || null,
    };
  }

  async updateRestaurantSubscription(restaurant: Restaurant) {
    restaurant.subscriptionId = '';  // Use string vazia em vez de null
    restaurant.subscriptionStatus = 'free';
    await this.restaurantService.save(restaurant);
  }

  async handlePrice(price: Stripe.Price) {
    return {
      price: price.unit_amount ? price.unit_amount / 100 : 0,
      currency: price.currency,
      interval: price.recurring?.interval || 'month',
    };
  }
}
