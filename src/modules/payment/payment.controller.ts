import { Body, Controller, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { TopupRequestDto } from "./dto/topup-request.dto";

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}
    
    @Post('topup')
    async createTransaction(@Body() body: TopupRequestDto) {
        return await this.paymentService.createTransaction(body)
    }
}
