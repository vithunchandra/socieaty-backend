import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PostCommentEntity } from "./post-comment.entity";
import { PostCommentDaoService } from "./post-comment.dao.service";

@Module({
    imports: [MikroOrmModule.forFeature([PostCommentEntity])],
    providers: [PostCommentDaoService],
    exports: [PostCommentDaoService]
})
export class PostCommentDaoModule{}