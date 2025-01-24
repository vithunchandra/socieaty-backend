import { UserEntity } from '../../../user/persistance/User.entity';

export class CreateAccessTokenDto {
	roomName: string;
	canPublish: boolean;
	canSubscribe: boolean;
	canPublishData: boolean;
	roomAdmin: boolean;
	user: UserEntity;
}
