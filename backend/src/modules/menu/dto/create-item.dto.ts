import { IsNotEmpty, IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'Caesar Salad' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Fresh romaine lettuce with our signature dressing' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 12.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  categoryId: string;

  @ApiPropertyOptional()
  @IsOptional()
  image?: Express.Multer.File;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
