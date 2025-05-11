import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common'
import { TopupService } from './topup.service'
import { CreateTopupRequestDto } from './dto/create-topup-request.dto'
import { AuthGuard } from '../../module/AuthGuard/auth-guard.service'
import { RolesGuard } from '../../module/RoleGuard/roles.guard'
import { Roles } from '../../module/RoleGuard/roles.decorator'
import { UserRole } from '../user/persistance/user.entity'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { TopupNotificationRequestDto } from './dto/topup-notification-request.dto'

@Controller('topup')
export class TopupController {
	constructor(private readonly topupService: TopupService) {}

	@Post()
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER)
	async createTopup(
		@Request() req: GuardedRequestDto,
		@Body() createTopupRequestDto: CreateTopupRequestDto
	) {
		return this.topupService.createTopup(req.user.customerData!, createTopupRequestDto)
	}

	@Post('notification')
	async topupNotification(@Body() body: TopupNotificationRequestDto) {
		return this.topupService.handleTopupNotification(body)
	}

	@Get(':topupId/track')
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(UserRole.CUSTOMER)
	async trackTopup(@Request() req: GuardedRequestDto, @Param('topupId') topupId: string) {
		return this.topupService.trackTopup(req.user, topupId)
	}
}
