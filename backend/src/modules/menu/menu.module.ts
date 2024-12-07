import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menu } from './entities/menu.entity';
import { Category } from './entities/category.entity';
import { Item } from './entities/item.entity';
import { StorageModule } from '../storage/storage.module';
import { RestaurantModule } from '../restaurant/restaurant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Menu, Category, Item]),
    StorageModule,
    RestaurantModule,
  ],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
