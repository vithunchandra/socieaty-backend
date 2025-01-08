import { Injectable, NotFoundException } from "@nestjs/common";
import { PostDaoService } from "./persistence/post.dao.service";
import { CreatePostRequestDto } from "./dto/create-post-request.dto";
import { UserEntity } from "../user/persistance/User.entity";
import { EntityManager } from "@mikro-orm/postgresql";
import { MediaDaoService } from "../post-media/persistence/post-media.dao.service";
import { PostMapper } from "./domain/post.mapper";
import { PostHashtagDaoService } from "../post-hashtag/persistence/post-hashtag.dao.service";
import { Post } from "./domain/post";
import { wrap } from "module";

@Injectable()
export class PostService{
    constructor(
        private readonly postDaoService: PostDaoService,
        private readonly mediaDaoService: MediaDaoService,
        private readonly postHashtagDaoService: PostHashtagDaoService,
        private readonly em: EntityManager
    ){}

    async createPost(user: UserEntity, data: CreatePostRequestDto, medias: Express.Multer.File[]) {
        console.log("Test")
        const post =  this.postDaoService.createPost({
            user: user.id,
            title: data.title,
            caption: data.caption,
            location: data.location,
        })
        const postMedias = this.mediaDaoService.createMedia(medias.map(media => {
            const extension = media.originalname.substring(media.originalname.lastIndexOf('.') + 1);
            let type = "image";
            if(extension.match(/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/)){
                type = "video"
            }
            return {
                url: media.path,
                type: type,
                post: post.id
            }
        }))
        const postHashTags = await this.postHashtagDaoService.createPostHastag({tags: data.hashtags})
        post.hashtags.add(postHashTags)
        await this.em.flush()

        const postInstance = await this.postDaoService.findOneById(post.id)
        const postDomain = PostMapper.toDomain(postInstance)
        return {post: postDomain}
    }

    async likePost(postId: string, userId: string){
        const post = await this.postDaoService.findOneById(postId)
        const user = await this.em.getRepository(UserEntity).findOne({id: userId})
        if(!post){
            throw new NotFoundException('Post not found')
        }
        if(!user){
            throw new NotFoundException('User not found')
        }
        const result = this.postDaoService.likePost({post, user})
        await this.em.flush()
        const refreshedPost = await this.em.refresh(post, {populate: ['postLikes']})
        return {
            isLiked: result,
            likes: PostMapper.ToPostLikesDomain(refreshedPost)
        }
    }

    async getAllPosts(){
        const posts = await this.postDaoService.findAll()
        return {
            posts: posts.map(post => PostMapper.toDomain(post)).filter(post => post !== null)
        }
    }

    async getPostLikes(post_id: string){
        const posts = await this.postDaoService.findOneById(post_id)
        return {
            likes: PostMapper.ToPostLikesDomain(posts)
        }
    }
}