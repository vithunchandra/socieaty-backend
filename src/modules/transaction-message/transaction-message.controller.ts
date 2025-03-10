import { Body, Controller, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { TransactionMessageService } from "./transaction-message.service";
import { AuthGuard } from "../../module/AuthGuard/AuthGuard.service";
import { GuardedRequestDto } from "../../module/AuthGuard/dto/guarded-request.dto";
import { CreateTransactionMessageRequestDto } from "./dto/create-transaction-message-request.dto";

@Controller('transactions/order/:id/messages')
export class TransactionMessageController {
    constructor(private readonly transactionMessageService: TransactionMessageService) {}

    @UseGuards(AuthGuard)
    @Post('')
    async createTransactionMessage(
        @Request() req: GuardedRequestDto,
        @Param('id') id: string,
        @Body() data: CreateTransactionMessageRequestDto
    ) {
        return this.transactionMessageService.createTransactionMessage(req.user, id, data.message)
    }

    @Get('track')
    @UseGuards(AuthGuard)
    async trackTransactionMessage(
        @Request() req: GuardedRequestDto,
        @Param('id') id: string,
    ){
        return this.transactionMessageService.trackTransactionMessage(req.user, id)
    }
}