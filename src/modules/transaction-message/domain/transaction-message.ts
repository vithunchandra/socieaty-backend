import { User } from "../../user/domain/User";

export class TransactionMessage {
    id: string;
    message: string;
    transactionId: string;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
