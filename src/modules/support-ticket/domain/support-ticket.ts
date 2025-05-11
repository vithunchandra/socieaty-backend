import { SupportTicketStatus } from "../../../enums/support-ticket.enum"
import { User } from "../../user/domain/user"

export class SupportTicket {
    id: string
    title: string
    description: string
    status: SupportTicketStatus
    user: User
    createdAt: Date
}

