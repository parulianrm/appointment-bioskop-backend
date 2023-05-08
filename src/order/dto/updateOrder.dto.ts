import { IsNumber, IsString } from 'class-validator';

export class UpdateOrderDto {
  statusId?: number;
  biaya_total?: number;
  nama?: string;
  telephone?: string;
  statusPaymentId?: number;
  kursi?: string;
}
