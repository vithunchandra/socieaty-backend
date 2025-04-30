import { IsNotEmpty, IsString } from 'class-validator'
import { SupportTicketStatus } from '../../../enums/support-ticket.enum'
import { fieldToSupportTicketStatus } from '../../../utils/request_field_transformer.util'
import { Transform } from 'class-transformer'

export class CreateSupportTicketRequestDto {
	@IsString()
	@IsNotEmpty()
	title: string

	@IsString()
	@IsNotEmpty()
	description: string
}
