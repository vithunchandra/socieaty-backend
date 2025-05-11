import { Topup } from "../domain/topup"
import { User } from "../../user/domain/user"

export class TopupNotificationResponseDto {
    topup: Topup
    customer: User
}