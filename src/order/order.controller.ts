import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/createOrder.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get('all')
  async getAllOrders() {
    const result = this.orderService.getAllOrder();
    console.log(result);
    return result;
  }

  @Post('create')
  createOrder(@Body() body: CreateOrderDTO) {
    return this.orderService.createOrder(body);
  }
}
