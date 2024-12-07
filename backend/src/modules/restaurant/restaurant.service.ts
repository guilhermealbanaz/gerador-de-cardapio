import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { StorageService } from '../storage/storage.service';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly storageService: StorageService,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto, user: User): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create({
      ...createRestaurantDto,
      userId: user.id,
    });

    if (createRestaurantDto.logo) {
      restaurant.logoUrl = await this.storageService.uploadFile(
        createRestaurantDto.logo,
        'restaurant-logos',
      );
    }

    return this.restaurantRepository.save(restaurant);
  }

  async findAll(user: User): Promise<Restaurant[]> {
    return this.restaurantRepository.find({
      where: { userId: user.id },
      relations: ['menus'],
    });
  }

  async findOne(id: string, user: User): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['menus', 'menus.categories', 'menus.categories.items'],
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (restaurant.userId !== user.id && user.role !== 'admin') {
      throw new UnauthorizedException('Not authorized to access this restaurant');
    }

    return restaurant;
  }

  async update(
    id: string,
    updateRestaurantDto: Partial<CreateRestaurantDto>,
    user: User,
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id, user);

    if (updateRestaurantDto.logo) {
      if (restaurant.logoUrl) {
        await this.storageService.deleteFile(restaurant.logoUrl);
      }
      restaurant.logoUrl = await this.storageService.uploadFile(
        updateRestaurantDto.logo,
        'restaurant-logos',
      );
    }

    Object.assign(restaurant, updateRestaurantDto);
    return this.restaurantRepository.save(restaurant);
  }

  async remove(id: string, user: User): Promise<void> {
    const restaurant = await this.findOne(id, user);
    
    if (restaurant.logoUrl) {
      await this.storageService.deleteFile(restaurant.logoUrl);
    }
    
    await this.restaurantRepository.remove(restaurant);
  }

  async findByStripeCustomerId(stripeCustomerId: string): Promise<Restaurant | null> {
    return this.restaurantRepository.findOne({
      where: { stripeCustomerId },
      relations: ['menus', 'menus.categories', 'menus.categories.items'],
    });
  }

  async save(restaurant: Restaurant): Promise<Restaurant> {
    return this.restaurantRepository.save(restaurant);
  }
}
