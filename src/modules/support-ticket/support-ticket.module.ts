import { Module } from '@nestjs/common'
import { SupportTicketMessageGateway } from './support-ticket-message.gateway'
import { SupportTicketController } from './support-ticket.controller'
import { SupportTicketGateway } from './support-ticket.gateway'
import { SupportTicketService } from './support-ticket.service'
import { SupportTicketDaoModule } from './persistence/support-ticket.dao.module'
import { UserDaoModule } from '../user/persistance/user.dao.module'

@Module({
	imports: [SupportTicketDaoModule, UserDaoModule],
	controllers: [SupportTicketController],
	providers: [SupportTicketService, SupportTicketGateway, SupportTicketMessageGateway],
	exports: [SupportTicketService]
})
export class SupportTicketModule {}
