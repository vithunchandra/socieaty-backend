import { PaginationQueryDto } from "../../../../dto/pagination-query.dto";
import { SupportTicketStatus } from "../../../../enums/support-ticket.enum";

class GetSupportTicketsQueryDto {
    userId?: string;
    status?: SupportTicketStatus;
    searchQuery?: string;
    paginationQuery: PaginationQueryDto;
}

export { GetSupportTicketsQueryDto }


