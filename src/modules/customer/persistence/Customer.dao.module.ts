import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { Customer } from "./Customer.entity";
import { CustomerDaoService } from "./Customer.dao.service";

@Module({
    imports: [MikroOrmModule.forFeature([Customer])],
    controllers: [],
    providers: [CustomerDaoService],
    exports: [CustomerDaoService]
})
export class CustomerDaoModule{}