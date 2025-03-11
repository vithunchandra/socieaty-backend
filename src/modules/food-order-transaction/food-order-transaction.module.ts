import { Module } from "@nestjs/common";
import { FoodOrderTransactionDaoModule } from "./persistence/food-order-transaction.dao.module";
import { RestaurantDaoModule } from "../restaurant/persistence/Restaurant.dao.module";
import { FoodMenuDaoModule } from "../food-menu/persistence/food-menu.dao.module";
import { UserDaoModule } from "../user/persistance/User.dao.module";
import { FoodOrderTransactionController } from "./food-order-transaction.controller";
import { FoodOrderTransactionService } from "./food-order-transaction.service";
import { FoodOrderTransactionGateway } from "./food-order-transaction.gateway";
import { TransactionDaoModule } from "../transaction/persistence/transaction.dao.module";

@Module({
    imports: [FoodOrderTransactionDaoModule, TransactionDaoModule, RestaurantDaoModule, FoodMenuDaoModule, UserDaoModule],
    controllers: [FoodOrderTransactionController],
    providers: [FoodOrderTransactionService, FoodOrderTransactionGateway],
    exports: [FoodOrderTransactionService]
})
export class FoodOrderTransactionModule {}
