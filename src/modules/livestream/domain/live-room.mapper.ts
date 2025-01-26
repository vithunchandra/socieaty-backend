import { Room } from "livekit-server-sdk";
import { LiveRoom } from "./live-room";
import { LiveRoomMetaDataMapper } from "./live-room-meta-data.mapper";
import { UserEntity } from "src/modules/user/persistance/User.entity";
import { UserMapper } from "src/modules/user/domain/user.mapper";

export class LiveRoomMapper{
    static toDomain(data: Room, owner: UserEntity): LiveRoom{
        const metadata = LiveRoomMetaDataMapper.toDomain(data.metadata)
        return {
            roomName: data.name,
            metadata: metadata,
            owner: UserMapper.toDomain(owner),
            createdAt: new Date(Number(data.creationTime) * 1000)
        }
    }
}