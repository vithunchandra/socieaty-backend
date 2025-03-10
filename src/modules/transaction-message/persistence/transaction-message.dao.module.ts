import { Module } from "@nestjs/common";
import { TransactionMessageDaoService } from "./transaction-message.dao.service";
import { TransactionMessageEntity } from "./transaction-message.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";

@Module({
    imports: [MikroOrmModule.forFeature([TransactionMessageEntity])],
    providers: [TransactionMessageDaoService],
    exports: [TransactionMessageDaoService]
})
export class TransactionMessageDaoModule {}