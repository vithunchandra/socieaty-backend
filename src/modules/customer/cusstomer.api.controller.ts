import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { CustomerService } from "./customer.api.service";
import { Roles } from "src/module/RoleGuard/roles.decorator";
import { UserRole } from "../user/persistance/User.entity";
import { RolesGuard } from "src/module/RoleGuard/roles.guard";
import { AuthGuard } from "src/module/AuthGuard/AuthGuard.service";

@Controller('customer')
export class CustomerController{
    constructor(private customerService: CustomerService){}

    @Get('profile')
    @Roles(UserRole.CUSTOMER)
    @UseGuards(AuthGuard, RolesGuard)
    async getProfile(@Request() req){
        return await this.customerService.getProfile(req.user.id)
    }
}