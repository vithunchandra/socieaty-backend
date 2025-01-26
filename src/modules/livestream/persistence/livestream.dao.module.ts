import { Module } from "@nestjs/common";
import { LivestreamDaoService } from "./livestream.dao.service";
import { LivestreamRoomCommentEntity } from "./livestream-room-comment.entity";
import { LivestreamRoomLikeEntity } from "./livestream-room-like.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";

@Module({
    imports: [MikroOrmModule.forFeature([LivestreamRoomCommentEntity, LivestreamRoomLikeEntity])],
    controllers: [],
    providers: [LivestreamDaoService],
    exports: [LivestreamDaoService]
})
export class LivestreamDaoModule{}