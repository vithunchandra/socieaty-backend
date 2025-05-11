import { UserEntity } from '../../../user/persistance/user.entity';

export class CreateAccessTokenDto {
	roomName: string;
	canPublish: boolean;
	canSubscribe: boolean;
	canPublishData: boolean;
	roomAdmin: boolean;
	roomCreate: boolean;
	user: UserEntity;
}
