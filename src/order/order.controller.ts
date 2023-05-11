import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { Order } from '.prisma/client';

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

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  async getAllOrders(): Promise<OrderType[]> {
    const result = await this.orderService.getAllOrder();
    return result;
  }

  @Get('booked-ticket/')
  async getBookedTicket(
    @Query('id_film') id_film: string,
    @Query('nama_studio') nama_studio: string,
    @Query('jam') jam: string,
    @Query('tanggal') tanggal: string,
  ): Promise<{
    jumlah_kursi: number;
    kursi_booked: string;
    nama_studio: string;
    id_film: string;
  }> {
    const result = this.orderService.getBookedTicket(
      id_film,
      nama_studio,
      jam,
      tanggal,
    );
    return result;
  }

  @Get('summary-film')
  async getSummaryOrders(): Promise<
    {
      _sum: { jumlah_kursi: number };
      id_film: string;
      nama_film: string;
    }[]
  > {
    const result = await this.orderService.getSummaryFilm();
    return result;
  }

  @Get('summary-booking')
  async getSummaryBooking(): Promise<
    {
      statusName: string;
      value: {
        _sum: { jumlah_kursi: number };
      };
    }[]
  > {
    const result = await this.orderService.getSummaryBooking();
    return result;
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<OrderType> {
    return await this.orderService.getUniqueFilm(Number(id));
  }

  @Post('create')
  async createOrder(@Body() body: CreateOrderDTO): Promise<{
    status: string;
    messages: string;
    data: OrderType;
  }> {
    return await this.orderService.createOrder(body);
  }

  @Put('update/:id')
  async updateOrder(
    @Body() body: UpdateOrderDto,
    @Param('id') id: string,
  ): Promise<{
    status: string;
    message: string;
    data: OrderType;
  }> {
    return await this.orderService.updateOrder(body, Number(id));
  }
}
