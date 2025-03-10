import { Module } from "@nestjs/common";
import { TransactionMessageController } from "./transaction-message.controller";
import { TransactionDaoModule } from "../transaction/persistence/transaction.dao.module";
import { TransactionMessageService } from "./transaction-message.service";
import { TransactionMessageDaoModule } from "./persistence/transaction-message.dao.module";
import { TransactionMessageGateway } from "./transaction-message.gateway";
import { UserDaoModule } from "../user/persistance/User.dao.module";

@Module({
	imports: [TransactionDaoModule, TransactionMessageDaoModule, UserDaoModule],
    controllers: [TransactionMessageController],
	providers: [TransactionMessageService, TransactionMessageGateway],
	exports: [TransactionMessageService]
})
export class TransactionMessageModule {}

