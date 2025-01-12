import { Module } from "@nestjs/common";
import { PostMediaController } from "./post-media.controller";

@Module({
    controllers: [PostMediaController],
    providers: [],
    exports: []
})
export class PostMediaModule{}