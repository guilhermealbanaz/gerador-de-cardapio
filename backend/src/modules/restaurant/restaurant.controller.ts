import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { User } from '../auth/entities/user.entity';

interface RequestWithUser extends ExpressRequest {
  user: User;
}

@ApiTags('restaurants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @UploadedFile() logo: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {
    return this.restaurantService.create(
      { ...createRestaurantDto, logo },
      req.user,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all restaurants for current user' })
  async findAll(@Request() req: RequestWithUser) {
    return this.restaurantService.findAll(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID' })
  async findOne(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.restaurantService.findOne(id, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant' })
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: Partial<CreateRestaurantDto>,
    @UploadedFile() logo: Express.Multer.File,
    @Request() req: RequestWithUser,
  ) {
    return this.restaurantService.update(
      id,
      { ...updateRestaurantDto, logo },
      req.user,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete restaurant' })
  async remove(@Param('id') id: string, @Request() req: RequestWithUser) {
    return this.restaurantService.remove(id, req.user);
  }
}
