import { User } from "../../user/domain/User"

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
