import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Headers,
  Get,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Request as ExpressRequest } from 'express';
import { User } from '../auth/entities/user.entity';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

interface CustomRequest extends ExpressRequest {
  rawBody: Buffer;
}

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new subscription' })
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @Request() req: RequestWithUser,
  ) {
    return this.subscriptionService.createSubscription(
      createSubscriptionDto,
      req.user,
    );
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Handle Stripe webhooks' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Request() req: CustomRequest,
  ) {
    return this.subscriptionService.handleWebhook(signature, req.rawBody);
  }

  @Post(':restaurantId/cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel subscription' })
  async cancelSubscription(
    @Param('restaurantId') restaurantId: string,
    @Request() req: RequestWithUser,
  ) {
    return this.subscriptionService.cancelSubscription(restaurantId, req.user);
  }

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans' })
  async getSubscriptionPlans() {
    return this.subscriptionService.getSubscriptionPlans();
  }
}
