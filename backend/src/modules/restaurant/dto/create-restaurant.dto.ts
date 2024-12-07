import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Restaurant Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Restaurant Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  logo?: Express.Multer.File;
}
