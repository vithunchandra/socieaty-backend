import { UserMapper } from "../../user/domain/user.mapper"
import { SupportTicketMessageEntity } from "../persistence/support-ticket-message.entity"
import { SupportTicketMessage } from "./support-ticket-message"

export class SupportTicketMessageMapper {
	static toDomain(raw: SupportTicketMessageEntity): SupportTicketMessage | null {
		if (!raw) return null
		const supportTicketMessage = new SupportTicketMessage()
		supportTicketMessage.id = raw.id
		supportTicketMessage.message = raw.message
		supportTicketMessage.createdAt = raw.createdAt
		supportTicketMessage.user = UserMapper.toDomain(raw.user)
		supportTicketMessage.supportTicketId = raw.supportTicket.id
		return supportTicketMessage
	}
}