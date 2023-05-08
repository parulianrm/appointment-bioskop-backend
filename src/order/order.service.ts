import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { Order, Prisma } from '@prisma/client';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Injectable()
export class OrderService {
  constructor(private dbService: PrismaService) {}

  async getSummaryFilm() {
    const uniqueEmails = await this.dbService.order.groupBy({
      by: ['id_film', 'nama_film'],
      _sum: {
        jumlah_kursi: true,
      },
    });
    return uniqueEmails;
  }

  async getBookedTicket(id_film, nama_studio, jam, tanggal) {
    const result = await this.dbService.order.findMany({
      where: {
        id_film: id_film,
        nama_studio: nama_studio,
        jam: jam,
        tanggal: tanggal,
      },
    });

    const jumlah_kursi = result.reduce((sum, item) => {
      return sum + item.jumlah_kursi;
    }, 0);

    const kursi_booked = result.reduce((sum, item) => {
      return `${sum}|${item.kursi}`;
    }, '');

    return {
      jumlah_kursi,
      kursi_booked,
      nama_studio,
      id_film,
    };
  }

  async getUniqueFilm(id) {
    try {
      const result = await this.dbService.order.findUnique({
        where: {
          id,
        },
      });
      if (!result) {
        throw new BadRequestException('Bad Request', {
          description: 'Id tidak ditemukan',
        });
      }
      return result;
    } catch (err) {
      return err;
    }
  }

  async getAllOrder() {
    return await this.dbService.order.findMany();
  }

  async createOrder(body: CreateOrderDTO) {
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

  async updateOrder(body: UpdateOrderDto, id: number) {
    try {
      type UpdateDataType = { status?: string; statusPayment?: string };
      const updateData: UpdateDataType = {};

      if (body.statusId != 0 && body.statusId != 1) {
        throw new BadRequestException('Body statusId must be number 1 or 0', {
          cause: new Error(),
          description:
            'Hanya boleh menggunakan angka 1 untuk (Booked) dan angka 0 untuk (cancel) ',
        });
      }

      if (body.statusId !== null && body.statusId !== undefined) {
        updateData.status = body.statusId == 1 ? 'booked' : 'cancel';
      }

      if (body.statusPaymentId !== null && body.statusPaymentId !== undefined) {
        updateData.statusPayment =
          body.statusPaymentId == 1 ? 'sudah bayar' : 'belum bayar';
      }

      console.log(updateData);

      const result = await this.dbService.order.update({
        where: { id: id },
        data: {
          ...body,
          ...updateData,
        },
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
