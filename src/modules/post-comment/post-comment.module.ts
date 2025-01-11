import { Module } from "@nestjs/common";
import { PostCommentDaoModule } from "./persistence/post-comment.dao.module";
import { PostCommentService } from "./post-comment.service";
import { PostCommentController } from "./post-comment.controller";
import { UserDaoModule } from "../user/persistance/User.dao.module";

@Module({
    imports: [PostCommentDaoModule, UserDaoModule],
    controllers: [PostCommentController],
    providers: [PostCommentService]
})
export class PostCommentModule{}