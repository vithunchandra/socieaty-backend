import { User } from "../../user/domain/user";

export class TransactionMessage {
    id: string;
    message: string;
    transactionId: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
