import { LiveRoomMetadata } from './live-room-metadata'

export class LiveRoomMetaDataMapper {
	static toDomain(data: string): LiveRoomMetadata {
		const metaData = JSON.parse(data)
		return {
			roomTitle: metaData['roomTitle'],
			ownerId: metaData['ownerId']
		}
	}
}
