import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
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

  @Get('summary-film')
  async getSummaryOrders() {
    const result = await this.orderService.getSummaryFilm();
    return result;
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
