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
        const postComment = await this.postCommentDaoService.createPostComment({
            text: data.text,
            postId,
            userId
        })
        await this.em.flush();
        return {
            comment: PostCommentMapper.toDomain(postComment)
        };
    }

    async likePostComment(commentId: string, userId: string, isLiked: boolean){
        const comment = await this.postCommentDaoService.findOneById(commentId)
        const user = await this.userDaoService.findOneById(userId)
        if(!comment){
            throw new NotFoundException('Comment or User not found')
        }
        if(!user){
            throw new NotFoundException('User not found')
        }
        const alreadyLiked = await this.postCommentDaoService.isLiked(userId, commentId)
        let result = isLiked;
        if(alreadyLiked !== isLiked){
            result = this.postCommentDaoService.likePostComment({comment, user})
        }
        await this.em.flush()
        const refreshedComment = await this.em.refresh(comment, {populate: ['commentLikes']})
        return {
            isLiked: result,
            likes: refreshedComment!.commentLikes.length
        }
    }

    async isLiked(userId: string, commentId: string){
        const comment = await this.postCommentDaoService.findOneById(commentId)
        if(!comment){
            throw new NotFoundException('Comment not found')
        }
        const result = await this.postCommentDaoService.isLiked(userId, commentId)
        return {
            isLiked: result
        }
    }

    async getPostCommentByPostId(postId: string){
        const comments = await this.postCommentDaoService.getPostCommentByPostId(postId)
        return {
            comments: comments.map(comment => PostCommentMapper.toDomain(comment))
        }
    }
}