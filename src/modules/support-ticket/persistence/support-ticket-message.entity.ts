import { Entity, ManyToOne, Property } from "@mikro-orm/core"
import { BaseEntity } from "../../../database/model/base/base.entity"
import { UserEntity } from "../../user/persistance/user.entity"
import { SupportTicketEntity } from "./support-ticket.entity"

@Entity({ tableName: 'support-ticket-messages' })
export class SupportTicketMessageEntity extends BaseEntity {
	@Property()
	message: string

	@ManyToOne({
		entity: () => UserEntity,
		fieldName: 'user_id',
		index: true
	})
	user: UserEntity

	@ManyToOne({
		entity: () => SupportTicketEntity,
		fieldName: 'support_ticket_id',
		index: true
	})
	supportTicket: SupportTicketEntity

	constructor(supportTicket: SupportTicketEntity, message: string) {
		super()
		this.supportTicket = supportTicket
		this.message = message
	}
}