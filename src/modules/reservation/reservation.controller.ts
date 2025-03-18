import { Body, Controller, Get, Param, Post, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ReservationService } from "./reservation.service";
import { AuthGuard } from "../../module/AuthGuard/AuthGuard.service";
import { CreateReservationRequestDto } from "./dto/create-reservation-request.dto";
import { Roles } from "../../module/RoleGuard/roles.decorator";
import { RolesGuard } from "../../module/RoleGuard/roles.guard";
import { UserRole } from "../user/persistance/User.entity";
import { GuardedRequestDto } from "../../module/AuthGuard/dto/guarded-request.dto";

@Controller('reservation')
export class ReservationController{
    constructor(private readonly reservationService: ReservationService){}

    @Post()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.CUSTOMER)
    async createReservation(@Request() req: GuardedRequestDto, @Body() dto: CreateReservationRequestDto){
        if(!req.user.customerData){
            throw new UnauthorizedException('Customer data not found')
        }
        return this.reservationService.createReservation(req.user.customerData, dto)
    }

    

    @Get(':id')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.CUSTOMER, UserRole.RESTAURANT)
    async getReservation(@Request() req: GuardedRequestDto, @Param('id') id: string){
        return this.reservationService.findReservationById(id, req.user)
    }
}