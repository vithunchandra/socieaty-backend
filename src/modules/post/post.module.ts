import { Module } from "@nestjs/common";
import { PostDaoModule } from "./persistence/post.dao.module";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { MediaDaoModule } from "../post-media/persistence/media.dao.module";
import { ConfigModule } from "@nestjs/config";
import { AuthGuardModule } from "src/module/AuthGuard/AuthGuard.module";
import { UserDaoModule } from "../user/persistance/User.dao.module";

@Module({
    imports: [
        PostDaoModule, 
        MediaDaoModule, 
        ConfigModule.forRoot(),
        AuthGuardModule,
        UserDaoModule
    ],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule{}