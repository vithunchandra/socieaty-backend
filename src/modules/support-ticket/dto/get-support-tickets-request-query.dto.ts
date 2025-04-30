import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SupportTicketStatus } from "../../../enums/support-ticket.enum";
import { fieldToSupportTicketStatus } from "../../../utils/request_field_transformer.util";
import { Transform, Type } from "class-transformer";
import { PaginationQueryDto } from "../../../dto/pagination-query.dto";

export class GetSupportTicketsRequestQueryDto{
    @IsNotEmpty()
    @Type(() => PaginationQueryDto)
    paginationQuery: PaginationQueryDto

    @IsOptional()
    @IsString()
    searchQuery?: string

    @IsOptional()
    @IsString()
    userId?: string

    @IsOptional()
    @Transform((data) => fieldToSupportTicketStatus(data))
    status?: SupportTicketStatus
}