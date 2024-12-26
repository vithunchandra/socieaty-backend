import { InjectRepository } from "@mikro-orm/nestjs";
import { PostEntity } from "./post.entity";
import { EntityRepository } from "@mikro-orm/postgresql";
import { PostCreateDto } from "./dto/post-create.dto";
import { Injectable } from "@nestjs/common";

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

    async findOneById(post_id: string): Promise<PostEntity | null>{
        const post = await this.postRepository.findOne({
            id: post_id
        }, {populate: ['medias', 'comments', 'likes']})
        return post
    }
}