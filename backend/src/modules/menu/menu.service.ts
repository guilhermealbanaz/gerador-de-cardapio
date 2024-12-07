import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { Category } from './entities/category.entity';
import { Item } from './entities/item.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { StorageService } from '../storage/storage.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly storageService: StorageService,
    private readonly restaurantService: RestaurantService,
  ) {}

  async createMenu(createMenuDto: CreateMenuDto, user: User): Promise<Menu> {
    await this.restaurantService.findOne(createMenuDto.restaurantId, user);
    
    const menu = this.menuRepository.create(createMenuDto);
    return this.menuRepository.save(menu);
  }

  async createCategory(createCategoryDto: CreateCategoryDto, user: User): Promise<Category> {
    const menu = await this.findMenu(createCategoryDto.menuId, user);
    
    const lastCategory = await this.categoryRepository.findOne({
      where: { menuId: menu.id },
      order: { order: 'DESC' },
    });

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      order: createCategoryDto.order ?? (lastCategory?.order ?? 0) + 1,
    });

    return this.categoryRepository.save(category);
  }

  async createItem(createItemDto: CreateItemDto, user: User): Promise<Item> {
    const category = await this.findCategory(createItemDto.categoryId, user);
    
    const lastItem = await this.itemRepository.findOne({
      where: { categoryId: category.id },
      order: { order: 'DESC' },
    });

    let imageUrl: string | undefined;
    if (createItemDto.image) {
      imageUrl = await this.storageService.uploadFile(
        createItemDto.image,
        'menu-items',
      );
    }

    const item = this.itemRepository.create({
      ...createItemDto,
      imageUrl,
      order: createItemDto.order ?? (lastItem?.order ?? 0) + 1,
    });

    return this.itemRepository.save(item);
  }

  async findMenu(id: string, user: User): Promise<Menu> {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!menu) {
      throw new NotFoundException('Menu not found');
    }

    await this.restaurantService.findOne(menu.restaurantId, user);
    return menu;
  }

  async findCategory(id: string, user: User): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['menu', 'menu.restaurant'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.restaurantService.findOne(category.menu.restaurantId, user);
    return category;
  }

  async updateItemOrder(categoryId: string, itemOrders: { id: string; order: number }[], user: User): Promise<void> {
    const category = await this.findCategory(categoryId, user);
    
    await Promise.all(
      itemOrders.map(({ id, order }) =>
        this.itemRepository.update(id, { order }),
      ),
    );
  }

  async updateCategoryOrder(menuId: string, categoryOrders: { id: string; order: number }[], user: User): Promise<void> {
    await this.findMenu(menuId, user);
    
    await Promise.all(
      categoryOrders.map(({ id, order }) =>
        this.categoryRepository.update(id, { order }),
      ),
    );
  }

  async deleteItem(id: string, user: User): Promise<void> {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: ['category', 'category.menu', 'category.menu.restaurant'],
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    await this.restaurantService.findOne(item.category.menu.restaurantId, user);

    if (item.imageUrl) {
      await this.storageService.deleteFile(item.imageUrl);
    }

    await this.itemRepository.remove(item);
  }
}
