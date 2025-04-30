import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { SupportTicketEntity } from "./support-ticket.entity";
import { SupportTicketDaoService } from "./support-ticket.dao.service";
import { SupportTicketMessageEntity } from "./support-ticket-message.entity";

@Module({
	imports: [MikroOrmModule.forFeature([SupportTicketEntity, SupportTicketMessageEntity])],
    providers: [SupportTicketDaoService],
    exports: [SupportTicketDaoService]
})
export class SupportTicketDaoModule{}