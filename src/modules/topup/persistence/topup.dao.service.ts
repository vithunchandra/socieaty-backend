import { Injectable } from "@nestjs/common";
import { TopupEntity } from "./topup.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityRepository } from "@mikro-orm/postgresql";
import { TopupStatusEnum } from "../../../enums/topup-status.enum";
import { CreateTopupDto } from "./dto/create-topup.dto";

@Injectable()
export class TopupDaoService {
    constructor(
        @InjectRepository(TopupEntity)
        private readonly topupRepository: EntityRepository<TopupEntity>
    ) {}

    createTopup(data: CreateTopupDto): TopupEntity {
        return this.topupRepository.create({
            customer: data.customer,
            amount: data.amount,
            status: TopupStatusEnum.PENDING,
        })
    }
    
    
}
