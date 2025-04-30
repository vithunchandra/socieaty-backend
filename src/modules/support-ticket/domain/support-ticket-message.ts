import { User } from "../../user/domain/User"

export class SupportTicketMessage {
	id: string
	supportTicketId: string
	message: string
	createdAt: Date
	user: User
}
