import { Controller, Get } from '@nestjs/common';

@Controller('order')
export class OrderController {
  @Get('all')
  getAllOrders() {
    return {
      data: 'satu',
      system: 'Order',
    };
  }
}
