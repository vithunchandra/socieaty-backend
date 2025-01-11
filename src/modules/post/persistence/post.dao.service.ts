import { InjectRepository } from "@mikro-orm/nestjs";
import { PostEntity } from "./post.entity";
import { EntityRepository } from "@mikro-orm/postgresql";
import { PostCreateDto } from "./dto/post-create.dto";
import { Injectable } from "@nestjs/common";
import { LikePostDto } from "./dto/like-post-dto";

@Injectable()
export class PostDaoService{
    constructor(
        @InjectRepository(PostEntity) 
        private readonly postRepository: EntityRepository<PostEntity> 
    ) {}

    createPost(postData: PostCreateDto){
        const post = this.postRepository.create({
            title: postData.title,
            caption: postData.caption,
            location: postData.location,
            user: postData.user
        })
        this.postRepository.getEntityManager().persist(post)
        return post;
    }

    likePost(data: LikePostDto){
        const {post, user} = data;
        const isExist = post.postLikes.find((like) => like.id === user.id)
        let isLiked = false;
        if(isExist){
            post.postLikes.remove(user)
            isLiked = false;
        }else{
            post.postLikes.add(user)
            isLiked = true;
        }
        return isLiked;
    }

    async isLiked(userId: string, postId: string){
        const post = await this.findOneById(postId)
        const isExist = post!.postLikes.exists((like) => like.id === userId)
        return isExist
    }

    async findOneById(post_id: string): Promise<PostEntity | null>{
        const post = await this.postRepository.findOne({
            id: post_id
        }, {populate: ['medias', 'comments.*', 'postLikes', 'user', 'hashtags.*']})
        return post
    }

    async findAll(){
        const posts = await this.postRepository.findAll({
            populate: ['medias', 'comments', 'comments.*', 'postLikes', 'hashtags', 'hashtags.post'], 
            orderBy: {createdAt: "DESC"}
        })
        return posts
    }
}