import { UserMapper } from '../../user/domain/user.mapper'
import { SupportTicketEntity } from '../persistence/support-ticket.entity'
import { SupportTicket } from './support-ticket'

export class SupportTicketMapper {
	static toDomain(raw: SupportTicketEntity | null): SupportTicket | null {
		if (!raw) return null
		const supportTicket = new SupportTicket()
		supportTicket.id = raw.id
		supportTicket.title = raw.title
		supportTicket.description = raw.description
		supportTicket.status = raw.status
		supportTicket.user = UserMapper.toDomain(raw.user)
		supportTicket.createdAt = raw.createdAt
		return supportTicket
	}
}
