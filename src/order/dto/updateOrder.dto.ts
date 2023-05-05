import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  statusId: number;

  @IsNumber()
  @IsNotEmpty()
  biaya_total: number;

  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;
}
