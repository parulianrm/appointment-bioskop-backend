import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { Prisma } from '@prisma/client';
import { UpdateOrderDto } from './dto/updateOrder.dto';

type OrderType = {
  id: number;
  id_film: string;
  nama_film: string;
  nama_studio: string;
  jam: string;
  jumlah_kursi: number;
  biaya_total: number;
  telephone: string;
  nama: string;
  tanggal: string;
  kursi: string;
  statusPaymentId?: number;
  statusPayment?: string;
};

type SummaryBooking = {
  statusName: string;
  value: {
    _sum: { jumlah_kursi: number };
  };
};

@Injectable()
export class OrderService {
  constructor(private dbService: PrismaService) {}

  async getSummaryFilm(): Promise<
    {
      _sum: { jumlah_kursi: number };
      id_film: string;
      nama_film: string;
    }[]
  > {
    const uniqueEmails = await this.dbService.order.groupBy({
      by: ['id_film', 'nama_film'],
      _sum: {
        jumlah_kursi: true,
      },
    });
    return uniqueEmails;
  }

  async getBookedTicket(
    id_film,
    nama_studio,
    jam,
    tanggal,
  ): Promise<{
    jumlah_kursi: number;
    kursi_booked: string;
    nama_studio: string;
    id_film: string;
  }> {
    const result: OrderType[] = await this.dbService.order.findMany({
      where: {
        id_film: id_film,
        nama_studio: nama_studio,
        jam: jam,
        tanggal: tanggal,
      },
    });

    const jumlah_kursi: number = result.reduce((sum, item) => {
      return sum + item.jumlah_kursi;
    }, 0);

    const kursi_booked: string = result.reduce((sum, item) => {
      return `${sum}|${item.kursi}`;
    }, '');

    return {
      jumlah_kursi,
      kursi_booked,
      nama_studio,
      id_film,
    };
  }

  async getSummaryBooking(): Promise<SummaryBooking[]> {
    let statusCancel: SummaryBooking = {
      statusName: 'Cancel',
      value: {
        _sum: {
          jumlah_kursi: 0,
        },
      },
    };
    let statusPaid: SummaryBooking = {
      statusName: 'Sudah Bayar',
      value: {
        _sum: {
          jumlah_kursi: 0,
        },
      },
    };
    let statusNotPaid: SummaryBooking = {
      statusName: 'Belum Bayar',
      value: {
        _sum: {
          jumlah_kursi: 0,
        },
      },
    };

    try {
      const result = await this.dbService.order.groupBy({
        by: ['status', 'statusPayment'],
        _sum: {
          jumlah_kursi: true,
        },
      });

      result.forEach((value) => {
        if (value.status === 'cancel') {
          statusCancel = {
            statusName: 'Cancel',
            value: {
              ...value,
            },
          };
        } else {
          if (value.statusPayment !== 'belum bayar') {
            statusPaid = {
              statusName: 'Sudah Bayar',
              value: {
                ...value,
              },
            };
          } else {
            statusNotPaid = {
              statusName: 'Belum Bayar',
              value: {
                ...value,
              },
            };
          }
        }
      });

      return [statusPaid, statusCancel, statusNotPaid];
    } catch (err) {
      return err;
    }
  }

  async getUniqueFilm(id): Promise<OrderType> {
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

  async getAllOrder(): Promise<OrderType[]> {
    return await this.dbService.order.findMany();
  }

  async createOrder(body: CreateOrderDTO): Promise<{
    status: string;
    messages: string;
    data: OrderType;
  }> {
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

  async updateOrder(
    body: UpdateOrderDto,
    id: number,
  ): Promise<{
    status: string;
    message: string;
    data: OrderType;
  }> {
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
