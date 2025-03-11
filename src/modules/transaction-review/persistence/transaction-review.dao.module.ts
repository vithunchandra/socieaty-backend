import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { TransactionReviewEntity } from "./transaction-review.entity";
import { TransactionReviewDaoService } from "./transaction-review.dao.service";

@Module({
    imports: [MikroOrmModule.forFeature([TransactionReviewEntity])],
    providers: [TransactionReviewDaoService],
    exports: [TransactionReviewDaoService]
})
export class TransactionReviewDaoModule{}