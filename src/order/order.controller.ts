import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get()
  async getAllOrders() {
    const result = await this.orderService.getAllOrder();
    return result;
  }

  @Get('booked-ticket/')
  async getBookedTicket(
    @Query('id_film') id_film,
    @Query('nama_studio') nama_studio,
    @Query('jam') jam,
    @Query('tanggal') tanggal,
  ) {
    const result = await this.orderService.getBookedTicket(
      id_film,
      nama_studio,
      jam,
      tanggal,
    );
    return result;
  }

  @Get('summary-film')
  async getSummaryOrders() {
    const result = await this.orderService.getSummaryFilm();
    return result;
  }

  @Get(':id')
  async getOrderById(@Param('id') id) {
    return await this.orderService.getUniqueFilm(Number(id));
  }

  @Post('create')
  async createOrder(@Body() body: CreateOrderDTO) {
    return await this.orderService.createOrder(body);
  }

  @Put('update/:id')
  async updateOrder(@Body() body: UpdateOrderDto, @Param('id') id) {
    return await this.orderService.updateOrder(body, Number(id));
  }
}
