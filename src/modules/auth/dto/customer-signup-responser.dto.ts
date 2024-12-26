import { User } from "src/modules/user/domain/User"

export class CustomerSignupResponseDto{
    token: string
    user: User
}