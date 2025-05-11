import { User } from "../../user/domain/user"

export class SupportTicketMessage {
	id: string
	supportTicketId: string
	message: string
	createdAt: Date
	user: User
}
