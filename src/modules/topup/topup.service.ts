import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { TopupDaoService } from "./persistence/topup.dao.service";
import { CustomerEntity } from "../customer/persistence/Customer.entity";
import { CreateTopupRequestDto } from "./dto/create-topup-request.dto";
import { MidtransService } from "../midtrans/midtrans.service";
import { CreateSnapTransactionResponseDto } from "../midtrans/dto/create-snap-transaction-response.dto";
import { EntityManager } from "@mikro-orm/postgresql";

@Injectable()
export class TopupService {
    constructor(
        private readonly topupDaoService: TopupDaoService,
        private readonly midtransService: MidtransService,
        private readonly em: EntityManager
    ) {}

    async createTopup(customer: CustomerEntity, createTopupRequestDto: CreateTopupRequestDto) {
        const topupEntity = this.topupDaoService.createTopup({
            customer: customer,
            amount: createTopupRequestDto.grossAmount
        })

        let snapTransactionResponse: CreateSnapTransactionResponseDto;
        try{
            snapTransactionResponse = await this.midtransService.createTopupTransaction({
                orderId: topupEntity.id,
                grossAmount: createTopupRequestDto.grossAmount,
                customer: customer
            })
        } catch (error) {
            throw new InternalServerErrorException('Failed to create topup transaction')
        }

        await this.em.flush()
        
        return {
            topup: topupEntity,
            snapResponse: snapTransactionResponse
        }
    }
}
