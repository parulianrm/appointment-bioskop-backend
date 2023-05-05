import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private dbService: PrismaService) {}

  async getAllOrder() {
    return this.dbService.order.findMany();
  }

  async createOrder(body: CreateOrderDTO) {
    console.log(body.telephone);
    try {
      const result = await this.dbService.order.create({
        data: {
          id_film: body.id_film,
          nama_film: body.nama_film,
          nama_studio: body.nama_studio,
          jam: body.jam,
          jumlah_kursi: body.jumlah_kursi,
          biaya_total: body.biaya_total,
          nama: body.nama,
          telephone: body.telephone,
          tanggal: body.tanggal,
          kursi: body.kursi,
          statusId: 1,
          status: 'booked',
        },
      });
      return {
        status: 'Ok',
        messages: 'Order telah berhasil dibuat',
        data: result,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Internal Error');
        }
      }
      throw error;
    }
  }

  async updateOrder({ body, id }) {
    try {
      if (body.statusId != 0 && body.statusId != 1) {
        throw new BadRequestException('Body Status Id must be number 1 or 0', {
          cause: new Error(),
          description: 'Some error description',
        });
      }

      const status = body.statusId == 0 ? 'cancel' : 'booked';

      const updateData = {
        ...body,
        status,
      };

      const result = await this.dbService.order.update({
        where: { id: Number(id) },
        data: updateData,
      });
      return {
        status: 'Ok',
        message: 'Order has been updated',
        data: result,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Internal Error');
        }
      }
      throw error;
    }
  }
}
