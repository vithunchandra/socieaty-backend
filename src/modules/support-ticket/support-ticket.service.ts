import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { SupportTicketDaoService } from './persistence/support-ticket.dao.service'
import { UserEntity, UserRole } from '../user/persistance/user.entity'
import { CreateSupportTicketRequestDto } from './dto/create-support-ticket-request.dto'
import { EntityManager } from '@mikro-orm/core'
import { SupportTicketMapper } from './domain/support-ticket.mapper'
import { UpdateSupportTicketRequestDto } from './dto/update-support-ticket-request.dto'
import { SupportTicketStatus } from '../../enums/support-ticket.enum'
import { GetSupportTicketsQueryDto } from './persistence/dto/get-support-tickets-query.dto'
import { PaginationDto } from '../../dto/pagination.dto'
import { CreateSupportTicketMessageRequestDto } from './dto/create-support-ticket-message-request.dto'
import { SupportTicketMessageMapper } from './domain/support-ticket-message.mapper'
import { SupportTicketMessageGateway } from './support-ticket-message.gateway'
import { SupportTicketGateway } from './support-ticket.gateway'

@Injectable()
export class SupportTicketService {
	constructor(
		private readonly supportTicketDaoService: SupportTicketDaoService,
		private readonly supportTicketMessageGateway: SupportTicketMessageGateway,
		private readonly supportTicketGateway: SupportTicketGateway,
		private readonly em: EntityManager
	) {}

	async createSupportTicket(user: UserEntity, dto: CreateSupportTicketRequestDto) {
		const supportTicket = await this.supportTicketDaoService.createSupportTicket({
			...dto,
			userId: user.id
		})

		await this.em.flush()
		const supportTicketDomain = SupportTicketMapper.toDomain(supportTicket)
		const admin = await this.em.findOne(UserEntity, { role: UserRole.ADMIN })
		this.supportTicketGateway.notifyNewSupportTicket(supportTicketDomain!, admin!)
		return {
			supportTicket: supportTicketDomain
		}
	}

	async updateSupportTicket(user: UserEntity, id: string, dto: UpdateSupportTicketRequestDto) {
		let supportTicket = await this.supportTicketDaoService.findSupportTicketById(id)
		if (!supportTicket) {
			throw new NotFoundException('Ticket tidak ditemukan')
		}
		if (supportTicket.user.id !== user.id) {
			throw new ForbiddenException('Ticket bukan milik user')
		}
		this.supportTicketDaoService.updateSupportTicket(supportTicket, dto)
		await this.em.flush()
		supportTicket = await this.supportTicketDaoService.findSupportTicketById(id)
		const supportTicketDomain = SupportTicketMapper.toDomain(supportTicket)
		const admin = await this.em.findOne(UserEntity, { role: UserRole.ADMIN })
		this.supportTicketGateway.notifySupportTicketChanges(supportTicketDomain!, admin!)
		return {
			supportTicket: supportTicketDomain
		}
	}

	async getSupportTicketById(user: UserEntity, id: string) {
		const supportTicket = await this.supportTicketDaoService.findSupportTicketById(id)
		if (!supportTicket) {
			throw new NotFoundException('Ticket tidak ditemukan')
		}
		if (user.role !== UserRole.ADMIN && supportTicket.user.id !== user.id) {
			throw new ForbiddenException('Ticket bukan milik user')
		}
		return {
			supportTicket: SupportTicketMapper.toDomain(supportTicket)
		}
	}

	async getSupportTickets(user: UserEntity, query: GetSupportTicketsQueryDto) {
		if (user.role !== UserRole.ADMIN && user.id !== query.userId) {
			throw new ForbiddenException('User tidak memiliki akses ke ticket ini')
		}

		if (user.role === UserRole.ADMIN) {
			query.userId = undefined
		} else {
			query.userId = user.id
		}

		const { items, count } = await this.supportTicketDaoService.findSupportTickets(query)
		const pagination = PaginationDto.createPaginationDto(
			count,
			query.paginationQuery.pageSize,
			query.paginationQuery.page
		)

		console.log(items)

		return {
			items: items.map(SupportTicketMapper.toDomain),
			pagination
		}
	}

	async createSupportTicketMessage(
		user: UserEntity,
		id: string,
		dto: CreateSupportTicketMessageRequestDto
	) {
		const supportTicket = await this.supportTicketDaoService.findSupportTicketById(id)
		if (!supportTicket) {
			throw new NotFoundException('Ticket tidak ditemukan')
		}
		if (user.role !== UserRole.ADMIN && supportTicket.user.id !== user.id) {
			throw new ForbiddenException('Ticket bukan milik user')
		}
		const supportTicketMessage = this.supportTicketDaoService.createSupportTicketMessage({
			message: dto.message,
			supportTicketId: id,
			userId: user.id
		})
		await this.em.flush()
		const supportTicketMessageDomain = SupportTicketMessageMapper.toDomain(supportTicketMessage)
		this.supportTicketMessageGateway.notifyNewSupportTicketMessage(
			supportTicket.id,
			supportTicketMessageDomain!
		)
		return {
			supportTicketMessage: supportTicketMessageDomain
		}
	}

	async getSupportTicketMessages(user: UserEntity, id: string) {
		const supportTicket = await this.supportTicketDaoService.findSupportTicketById(id)
		if (!supportTicket) {
			throw new NotFoundException('Ticket tidak ditemukan')
		}
		if (user.role !== UserRole.ADMIN && supportTicket.user.id !== user.id) {
			throw new ForbiddenException('Ticket bukan milik user')
		}
		const supportTicketMessages =
			await this.supportTicketDaoService.findSupportTicketMessages(id)
		return {
			supportTicketMessages: supportTicketMessages.map(SupportTicketMessageMapper.toDomain)
		}
	}

	async trackSupportTicketMessage(user: UserEntity, id: string) {
		const supportTicket = await this.supportTicketDaoService.findSupportTicketById(id)
		if (!supportTicket) {
			throw new NotFoundException('Ticket tidak ditemukan')
		}
		if (user.role !== UserRole.ADMIN && supportTicket.user.id !== user.id) {
			throw new ForbiddenException('Ticket bukan milik user')
		}

		const supportTicketMessages =
			await this.supportTicketDaoService.findSupportTicketMessages(id)
		this.supportTicketMessageGateway.trackSupportTicketMessage(user, id)

		return {
			supportTicketMessages: supportTicketMessages.map(SupportTicketMessageMapper.toDomain)
		}
	}
}
