import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDTO } from './dto/createOrder.dto';

@Injectable()
export class OrderService {
  constructor(private dbService: PrismaService) {}

  async getAllOrder() {
    return this.dbService.order.findMany();
  }

  async createOrder(body: CreateOrderDTO) {
    try {
      // const result = this.dbService.order.create({
      //   data: {
      //     id_film: body.id_film,
      //     nama_film: body.nama_film,
      //     nama_studio: body.nama_studio,
      //     jam: body.jam,
      //     jumlah_kursi: body.jumlah_kursi,
      //     biaya_total: body.biaya_total,
      //     nama: body.nama,
      //     telephone: body.telephone,
      //     tanggal: body.tanggal,
      //     kursi: body.kursi,
      //     statusId: body.statusId,
      //     status: body.status,
      //   },
      // });
      return body;
    } catch (error) {}
  }
}
