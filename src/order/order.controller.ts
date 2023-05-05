import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

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

  @Put('update/:id')
  updateOrder(@Body() body: UpdateOrderDto, @Param('id') id) {
    return this.orderService.updateOrder({ body, id });
  }
}
