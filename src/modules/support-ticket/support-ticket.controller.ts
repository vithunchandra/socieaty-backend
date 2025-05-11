import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common'
import { CreateSupportTicketRequestDto } from './dto/create-support-ticket-request.dto'
import { AuthGuard } from '../../module/AuthGuard/auth-guard.service'
import { GuardedRequestDto } from '../../module/AuthGuard/dto/guarded-request.dto'
import { SupportTicketService } from './support-ticket.service'
import { UpdateSupportTicketRequestDto } from './dto/update-support-ticket-request.dto'
import { GetSupportTicketsRequestQueryDto } from './dto/get-support-tickets-request-query.dto'
import { CreateSupportTicketMessageRequestDto } from './dto/create-support-ticket-message-request.dto'

@Controller('support-tickets')
export class SupportTicketController {
	constructor(private readonly supportTicketService: SupportTicketService) {}

	@Post()
	@UseGuards(AuthGuard)
	async createSupportTicket(
		@Request() req: GuardedRequestDto,
		@Body() dto: CreateSupportTicketRequestDto
	) {
		return await this.supportTicketService.createSupportTicket(req.user, dto)
	}

	@Put(':id')
	@UseGuards(AuthGuard)
	async updateSupportTicket(
		@Request() req: GuardedRequestDto,
		@Param('id') id: string,
		@Body() dto: UpdateSupportTicketRequestDto
	) {
		return await this.supportTicketService.updateSupportTicket(req.user, id, dto)
	}

	@Get(':id')
	@UseGuards(AuthGuard)
	async getSupportTicketById(@Request() req: GuardedRequestDto, @Param('id') id: string) {
		return await this.supportTicketService.getSupportTicketById(req.user, id)
	}

	@Get()
	@UseGuards(AuthGuard)
	async getSupportTickets(
		@Request() req: GuardedRequestDto,
		@Query() query: GetSupportTicketsRequestQueryDto
	) {
		return await this.supportTicketService.getSupportTickets(req.user, query)
	}

	@Post(':id/messages')
	@UseGuards(AuthGuard)
	async createSupportTicketMessage(
		@Request() req: GuardedRequestDto,
		@Param('id') id: string,
		@Body() dto: CreateSupportTicketMessageRequestDto
	) {
		return await this.supportTicketService.createSupportTicketMessage(req.user, id, dto)
	}

	@Get(':id/messages')
	@UseGuards(AuthGuard)
	async getSupportTicketMessages(@Request() req: GuardedRequestDto, @Param('id') id: string) {
		return await this.supportTicketService.getSupportTicketMessages(req.user, id)
	}

	@Get(':id/messages/track')
	@UseGuards(AuthGuard)
	async trackSupportTicketMessages(@Request() req: GuardedRequestDto, @Param('id') id: string) {
		return await this.supportTicketService.trackSupportTicketMessage(req.user, id)
	}
}
