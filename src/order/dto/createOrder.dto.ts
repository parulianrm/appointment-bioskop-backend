import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsString, NotContains } from 'class-validator';

export class CreateOrderDTO implements Prisma.OrderCreateInput {
  @IsNotEmpty()
  @IsString()
  id_film: string;

  @IsString()
  @IsNotEmpty()
  nama_film: string;

  @IsString()
  @IsNotEmpty()
  nama_studio: string;

  @IsString()
  @IsNotEmpty()
  jam: string;

  @IsNotEmpty()
  jumlah_kursi: number;

  @IsNotEmpty()
  biaya_total: number;

  telephone?: string;

  @NotContains("'")
  @NotContains('"')
  @IsNotEmpty()
  nama: string;

  @IsString()
  @IsNotEmpty()
  tanggal: string;

  @IsString()
  @IsNotEmpty()
  kursi: string;

  status?: number;

  statusId?: string;
}
