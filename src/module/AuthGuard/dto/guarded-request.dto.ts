import { UserEntity } from "../../../modules/user/persistance/user.entity";

export class GuardedRequestDto extends Request{
    user: UserEntity
}