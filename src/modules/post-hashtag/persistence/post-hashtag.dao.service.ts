import { InjectRepository } from "@mikro-orm/nestjs";
import { Injectable } from "@nestjs/common";
import { PostHashtagEntity } from "./post-hashtag.entity";
import { EntityRepository } from "@mikro-orm/postgresql";
import { CreatePostHashtagDto } from "./dto/create-post-hashtag.dto";

@Injectable()
export class PostHashtagDaoService{
    constructor(
        @InjectRepository(PostHashtagEntity)
        private readonly postHashtagRepository: EntityRepository<PostHashtagEntity>
    ){}

    async createPostHastag(data: CreatePostHashtagDto){
        const hashtags = data.tags;
        let newHashtags: PostHashtagEntity[] = [];
        for(const hashtag of hashtags){
            const isExist = await this.findByTag(hashtag);
            if(!isExist){
                newHashtags.push(this.postHashtagRepository.create({tag: hashtag}))
            }else{
                newHashtags.push(isExist)
            }
        }
        return newHashtags;
    }

    async findById(id: string){
        return this.postHashtagRepository.findOne({id}, {populate: ['post']});
    }

    async findByTag(tag: string){
        return this.postHashtagRepository.findOne({tag}, {populate: ['post']});
    }
}