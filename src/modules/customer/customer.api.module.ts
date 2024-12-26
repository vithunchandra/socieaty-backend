import { Module } from "@nestjs/common";
import { CustomerDaoModule } from "./persistence/Customer.dao.module";
import { UserDaoModule } from "../user/persistance/User.dao.module";
import { JwtModule } from "@nestjs/jwt";
import { CustomerService } from "./customer.api.service";
import { CustomerController } from "./cusstomer.api.controller";

@Module({
    imports: [CustomerDaoModule, UserDaoModule],
    providers: [CustomerService],
    controllers: [CustomerController],
    exports: [CustomerService]
})
export class CustomerModule{}