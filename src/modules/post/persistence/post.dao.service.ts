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
        let value = false;
        if(isExist){
            post.postLikes.remove(user)
            value = false;
        }else{
            post.postLikes.add(user)
            value = true;
        }
        return value;
    }

    async findOneById(post_id: string): Promise<PostEntity | null>{
        const post = await this.postRepository.findOne({
            id: post_id
        }, {populate: ['medias', 'comments', 'postLikes', 'user', 'hashtags']})
        return post
    }

    async findAll(){
        const posts = await this.postRepository.findAll({populate: ['medias', 'comments', 'postLikes', 'hashtags', 'hashtags.post']})
        return posts
    }
}