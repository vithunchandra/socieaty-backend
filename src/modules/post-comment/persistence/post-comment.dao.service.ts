import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { PostCommentEntity } from "./post-comment.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CreatePostCommentDto } from "./dto/create-post-comment.dto";
import { LikePostCommentDto } from "./dto/like-post-comment.dto";
import e from "express";

@Injectable()
export class PostCommentDaoService{
    constructor(
        @InjectRepository(PostCommentEntity)
        private readonly postCommentRepository: EntityRepository<PostCommentEntity>
    ){}

    async createPostComment(data: CreatePostCommentDto){
        const postComment = this.postCommentRepository.create({
            text: data.text,
            post: data.postId,
            user: data.userId
        })
        return postComment
    }

    likePostComment(data: LikePostCommentDto){
        const {comment, user} = data
        const isExist = comment.commentLikes.find((like) => like.id === user.id)
        let isLiked = false;
        if(isExist){
            comment.commentLikes.remove(user)
            isLiked = false;
        }else{
            comment.commentLikes.add(user)
            isLiked = true;
        }
        return isLiked
    }

    async isLiked(userId: string, commentId: string){
        const comment = await this.findOneById(commentId)
        const isExist = comment!.commentLikes.exists((like) => like.id === userId)
        return isExist
    }

    async getPostCommentByPostId(postId: string){
        return await this.postCommentRepository.find({post: postId}, {populate: ['commentLikes', 'user']})
    }

    async findOneById(commentId: string){
        return await this.postCommentRepository.findOne({id: commentId}, {populate: ['commentLikes', 'user']})
    }
}