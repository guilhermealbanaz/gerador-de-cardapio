import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ example: 'Main Menu' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Our main dinner menu' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  restaurantId: string;
}
