import { Room } from "livekit-server-sdk";
import { LiveRoom } from "./live-room";
import { LiveRoomMetaDataMapper } from "./live-room-meta-data.mapper";

export class LiveRoomMapper{
    static toDomain(data: Room): LiveRoom{
        const metadata = LiveRoomMetaDataMapper.toDomain(data.metadata)
        return {
            roomName: data.name,
            metadata: metadata,
            createdAt: new Date(Number(data.creationTime) * 1000)
        }
    }
}