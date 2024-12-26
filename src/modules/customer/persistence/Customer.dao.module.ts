import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { CustomerEntity } from "./Customer.entity";
import { CustomerDaoService } from "./Customer.dao.service";

@Module({
    imports: [MikroOrmModule.forFeature([CustomerEntity])],
    controllers: [],
    providers: [CustomerDaoService],
    exports: [CustomerDaoService]
})
export class CustomerDaoModule{}