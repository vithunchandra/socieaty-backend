import { Module } from "@nestjs/common";
import { PostCommentDaoModule } from "./persistence/post-comment.dao.module";
import { PostCommentService } from "./post-comment.service";
import { PostCommentController } from "./post-comment.controller";

@Module({
    imports: [PostCommentDaoModule],
    controllers: [PostCommentController],
    providers: [PostCommentService]
})
export class PostCommentModule{}