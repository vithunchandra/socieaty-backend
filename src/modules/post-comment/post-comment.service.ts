import { EntityManager } from "@mikro-orm/postgresql";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PostCommentDaoService } from "./persistence/post-comment.dao.service";
import { CreatePostCommentRequestDto } from "./dto/create-post-comment-request.dto";
import { PostCommentMapper } from "./domain/post-comment.mapper";
import { UserDaoService } from "../user/persistance/User.dao.service";

@Injectable()
export class PostCommentService{
    constructor(
        private readonly postCommentDaoService: PostCommentDaoService,
        private readonly userDaoService: UserDaoService,
        private readonly em: EntityManager
    ){}

    async createPostComment(postId: string, userId: string, data: CreatePostCommentRequestDto){
        const postComments = await this.postCommentDaoService.createPostComment({
            text: data.text,
            postId,
            userId
        })
        await this.em.flush();
        return {
            comments: PostCommentMapper.toDomain(postComments)
        };
    }

    async likePostComment(commentId: string, userId: string){
        const comment = await this.postCommentDaoService.findOneById(commentId)
        const user = await this.userDaoService.findOneById(userId)
        if(!comment){
            throw new NotFoundException('Comment or User not found')
        }
        if(!user){
            throw new NotFoundException('User not found')
        }
        const result = this.postCommentDaoService.likePostComment({comment, user})
        await this.em.flush()
        const refreshedComment = await this.em.refresh(comment, {populate: ['commentLikes']})
        return {
            isLiked: result,
            likes: refreshedComment!.commentLikes.length
        }
    }

    async getPostCommentByPostId(postId: string){
        const comments = await this.postCommentDaoService.getPostCommentByPostId(postId)
        return {
            comments: comments.map(comment => PostCommentMapper.toDomain(comment))
        }
    }
}