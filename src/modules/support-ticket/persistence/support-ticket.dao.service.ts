import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository, FilterQuery } from '@mikro-orm/postgresql'
import { Injectable } from '@nestjs/common'
import { SupportTicketEntity } from './support-ticket.entity'
import { CreateSupportTicketDto } from './dto/create-support-ticket.dto'
import { UpdateSupportTicketDto } from './dto/update-support-ticker.dto'
import { GetSupportTicketsQueryDto } from './dto/get-support-tickets-query.dto'
import { SupportTicketStatus } from '../../../enums/support-ticket.enum'
import { SupportTicketMessageEntity } from './support-ticket-message.entity'
import { CreateSupportTicketMessageDto } from './dto/create-support-ticket-message.dto'

@Injectable()
export class SupportTicketDaoService {
	constructor(
		@InjectRepository(SupportTicketEntity)
		private readonly supportTicketRepository: EntityRepository<SupportTicketEntity>,
		@InjectRepository(SupportTicketMessageEntity)
		private readonly supportTicketMessageRepository: EntityRepository<SupportTicketMessageEntity>
	) {}

	async createSupportTicket(dto: CreateSupportTicketDto): Promise<SupportTicketEntity> {
		const supportTicket = await this.supportTicketRepository.create({
			title: dto.title,
			description: dto.description,
			status: SupportTicketStatus.OPEN,
			user: dto.userId
		})
		return supportTicket
	}

	updateSupportTicket(entity: SupportTicketEntity, dto: UpdateSupportTicketDto) {
		entity.status = dto.status
		return entity
	}

	async findSupportTicketById(id: string) {
		const supportTicket = await this.supportTicketRepository.findOne(
			{ id },
			{ populate: ['user'] }
		)
		return supportTicket
	}

	async findSupportTickets(query: GetSupportTicketsQueryDto) {
		const { userId, status, searchQuery } = query
		const { page, pageSize } = query.paginationQuery

		const filterQuery: FilterQuery<SupportTicketEntity> = {}

		if (searchQuery) {
			filterQuery.$or = [
				{ title: { $ilike: `%${searchQuery}%` } },
				{ description: { $ilike: `%${searchQuery}%` } },
				{ user: { name: { $ilike: `%${searchQuery}%` } } }
			]
		}

		if (userId) {
			filterQuery.user = {
				id: userId
			}
		}

		if (status) {
			filterQuery.status = {
				$eq: status
			}
		}

		const [items, count] = await this.supportTicketRepository.findAndCount(filterQuery, {
			orderBy: { createdAt: 'desc' },
			offset: page * pageSize,
			limit: pageSize,
			populate: ['user']
		})

		return {
			items,
			count
		}
	}

	createSupportTicketMessage(dto: CreateSupportTicketMessageDto) {
		const supportTicketMessage = this.supportTicketMessageRepository.create({
			message: dto.message,
			supportTicket: dto.supportTicketId,
			user: dto.userId
		})
		return supportTicketMessage
	}

	async findSupportTicketMessages(supportTicketId: string) {
		const supportTicketMessages = await this.supportTicketMessageRepository.find(
			{
				supportTicket: supportTicketId
			},
			{ populate: ['user'], orderBy: { createdAt: 'asc' } }
		)
		return supportTicketMessages
	}
}
