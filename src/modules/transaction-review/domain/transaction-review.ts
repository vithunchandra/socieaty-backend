import { User } from "../../user/domain/user"

export class TransactionReview {
    id: string
    transactionId: string
    rating: number
    review: string
    reviewer: User
    restaurant: User
    createdAt: Date
    updatedAt: Date
}
