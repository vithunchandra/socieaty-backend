import { Body, Controller, Get, Param, Post, Put, Req, Request, UseGuards } from "@nestjs/common";
import { CreatePostCommentRequestDto } from "./dto/create-post-comment-request.dto";
import { PostCommentService } from "./post-comment.service";
import { AuthGuard } from "../../module/AuthGuard/auth-guard.service";
import { LikePostCommentRequestDto } from "./dto/like-post-comment-request.dto";

@Controller('post/:postId/comment')
export class PostCommentController{
    constructor(
        private readonly postCommentService: PostCommentService
    ){}

    @Post()
    @UseGuards(AuthGuard)
    async createPostComment(@Request() req, @Param('postId') postId: string, @Body() data: CreatePostCommentRequestDto){
        return await this.postCommentService.createPostComment(postId, req.user.id, data)
    }

    @Put(':commentId/like')
    @UseGuards(AuthGuard)
    async likePostComment(@Request() req, @Param('commentId') commentId: string, @Body() data: LikePostCommentRequestDto){
        return await this.postCommentService.likePostComment(commentId, req.user.id, data.isLiked)
    }

    @Get(':commentId/is-liked')
    @UseGuards(AuthGuard)
    async isLiked(@Request() req, @Param('commentId') commentId: string){
        return await this.postCommentService.isLiked(req.user.id, commentId)
    }

    @Get()
    @UseGuards(AuthGuard)
    async getPostCommentByPostId(@Param('postId') postId: string){
        return await this.postCommentService.getPostCommentByPostId(postId)
    }
}