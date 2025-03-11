import { Module } from "@nestjs/common";
import { TransactionReviewDaoModule } from "./persistence/transaction-review.dao.module";
import { TransactionReviewController } from "./transaction-review.controller";
import { TransactionReviewService } from "./transaction-review.service";
import { TransactionDaoModule } from "../transaction/persistence/transaction.dao.module";
import { UserDaoModule } from "../user/persistance/User.dao.module";

@Module({
    imports: [TransactionReviewDaoModule, TransactionDaoModule, UserDaoModule],
    controllers: [TransactionReviewController],
    providers: [TransactionReviewService]
})
export class TransactionReviewModule {}
