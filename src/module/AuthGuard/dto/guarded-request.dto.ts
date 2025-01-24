import { UserEntity } from "../../../modules/user/persistance/User.entity";

export class GuardedRequestDto extends Request{
    user: UserEntity
}