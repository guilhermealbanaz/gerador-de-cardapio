import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'price_H5UGwCE...' })
  @IsString()
  @IsNotEmpty()
  priceId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  restaurantId: string;
}
