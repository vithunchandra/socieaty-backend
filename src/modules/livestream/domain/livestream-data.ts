import { LivestreamRoomLikeEntity } from "../persistence/livestream-room-like.entity"
import { LivestreamRoomComment } from "./livestream-room-comment"
import { LivestreamRoomLike } from "./livestream-room-like"

export class LivestreamData{
    type: LivestreamDataType
    payload: LivestreamRoomComment | LivestreamRoomLike

    constructor(type: LivestreamDataType, payload: LivestreamRoomComment | LivestreamRoomLike){
        this.type = type
        this.payload = payload
    }
}

export enum LivestreamDataType{
    COMMENT = "comment",
    LIKE = "like"
}