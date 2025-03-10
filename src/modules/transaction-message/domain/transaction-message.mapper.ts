import { UserMapper } from "../../user/domain/user.mapper";
import { TransactionMessageEntity } from "../persistence/transaction-message.entity";
import { TransactionMessage } from "./transaction-message";

export class TransactionMessageMapper {
    static toDomain(raw: TransactionMessageEntity): TransactionMessage | null {
        if (!raw) return null
        return {
            id: raw.id,
            message: raw.message,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            transactionId: raw.transaction.id,
            user: UserMapper.toDomain(raw.user)
        }
    }
}