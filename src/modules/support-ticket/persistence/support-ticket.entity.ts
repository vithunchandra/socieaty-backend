import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../../database/model/base/base.entity";
import { UserEntity } from "../../user/persistance/user.entity";
import { SupportTicketStatus } from "../../../enums/support-ticket.enum";

@Entity({ tableName: "support_tickets" })
export class SupportTicketEntity extends BaseEntity{

    @Property({ type: "string" })
    title: string;

    @Property({ type: "string" })
    description: string;

    @Enum(() => SupportTicketStatus)
    status: SupportTicketStatus;

    @ManyToOne({
        entity: () => UserEntity,
        fieldName: "user_id",
        index: true
    })
    user: UserEntity;
}