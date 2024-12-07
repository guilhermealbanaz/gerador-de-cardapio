import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { User } from '../auth/entities/user.entity';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@ApiTags('menus')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('menus')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new menu' })
  async createMenu(@Body() createMenuDto: CreateMenuDto, @Request() req: RequestWithUser) {
    return this.menuService.createMenu(createMenuDto, req.user);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create a new category' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto, @Request() req: RequestWithUser) {
    return this.menuService.createCategory(createCategoryDto, req.user);
  }

  @Post('items')
  @ApiOperation({ summary: 'Create a new menu item' })
  @UseInterceptors(FileInterceptor('image'))
  async createItem(
    @Body() createItemDto: CreateItemDto,
    @UploadedFile() image: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {
    return this.menuService.createItem(
      { ...createItemDto, image },
      req.user,
    );
  }

  @Put('categories/:categoryId/order')
  @ApiOperation({ summary: 'Update items order in category' })
  async updateItemOrder(
    @Param('categoryId') categoryId: string,
    @Body() itemOrders: { id: string; order: number }[],
    @Request() req: RequestWithUser,
  ) {
    return this.menuService.updateItemOrder(categoryId, itemOrders, req.user);
  }

  @Put(':menuId/categories/order')
  @ApiOperation({ summary: 'Update categories order in menu' })
  async updateCategoryOrder(
    @Param('menuId') menuId: string,
    @Body() categoryOrders: { id: string; order: number }[],
    @Request() req: RequestWithUser,
  ) {
    return this.menuService.updateCategoryOrder(menuId, categoryOrders, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get menu by ID' })
  async findMenu(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.menuService.findMenu(id, req.user);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete menu item' })
  async deleteItem(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.menuService.deleteItem(id, req.user);
  }
}
