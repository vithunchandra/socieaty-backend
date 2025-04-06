import { Topup } from "../domain/topup"
import { User } from "../../user/domain/User"

export class TopupNotificationResponseDto {
    topup: Topup
    customer: User
}