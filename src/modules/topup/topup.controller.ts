import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { TopupService } from "./topup.service";
import { CreateTopupRequestDto } from "./dto/create-topup-request.dto";
import { AuthGuard } from "../../module/AuthGuard/AuthGuard.service";
import { RolesGuard } from "../../module/RoleGuard/roles.guard";
import { Roles } from "../../module/RoleGuard/roles.decorator";
import { UserRole } from "../user/persistance/User.entity";
import { GuardedRequestDto } from "../../module/AuthGuard/dto/guarded-request.dto";

@Controller('topup')
export class TopupController {
    constructor(private readonly topupService: TopupService) {}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.CUSTOMER)
    async createTopup(@Request() req: GuardedRequestDto, @Body() createTopupRequestDto: CreateTopupRequestDto) {
        return this.topupService.createTopup(req.user.customerData!, createTopupRequestDto)
    }
}
