import { User } from "src/modules/user/domain/user"

export class CustomerSignupResponseDto{
    token: string
    user: User
}