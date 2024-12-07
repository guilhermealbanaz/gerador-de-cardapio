import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Appetizers' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Start your meal right' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  menuId: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;
}
