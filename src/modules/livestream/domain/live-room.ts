import { LiveRoomMetadata } from './live-room-metadata';
import { User } from '../../user/domain/user';

export class LiveRoom {
	roomName: string;
	metadata: LiveRoomMetadata;
	owner: User;
	views: number;
	commentsCount: number;
	likesCount: number;
	createdAt: Date;
}
