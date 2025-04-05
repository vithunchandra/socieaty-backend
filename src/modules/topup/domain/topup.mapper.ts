import { TopupEntity } from "../persistence/topup.entity";
import { Topup } from "./topup";

export class TopupMapper {
    static toDomain(raw: TopupEntity): Topup {
        const topup = new Topup()
        topup.id = raw.id
        topup.amount = raw.amount
        topup.status = raw.status
        topup.transactionId = raw.transactionId
        topup.paymentType = raw.paymentType
        topup.settlementTime = raw.settlementTime
        topup.customerId = raw.customer.id
        topup.createdAt = raw.createdAt
        return topup
    }
}