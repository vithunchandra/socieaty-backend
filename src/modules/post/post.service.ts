import { Injectable } from "@nestjs/common";
import { PostDaoService } from "./persistence/post.dao.service";
import { CreatePostRequestDto } from "./dto/create-post-request.dto";
import { UserEntity } from "../user/persistance/User.entity";
import { EntityManager } from "@mikro-orm/postgresql";
import { MediaDaoService } from "../post-media/persistence/media.dao.service";
import { Post } from "./domain/post";
import { PostMapper } from "./domain/post.mapper";

@Injectable()
export class PostService{
    constructor(
        private readonly postDaoService: PostDaoService,
        private readonly mediaDaoService: MediaDaoService,
        private readonly em: EntityManager
    ){}

    async createPost(user: UserEntity, data: CreatePostRequestDto, medias: Express.Multer.File[]) {
        console.log("Test")
        const post =  this.postDaoService.createPost({
            user: user.id,
            title: data.title,
            caption: data.caption
        })
        const postMedias = this.mediaDaoService.createMedia(medias.map(media => {
            return {
                url: media.path,
                type: media.mimetype,
                post: post.id
            }
        }))
        await this.em.flush()
        const postInstance = await this.postDaoService.findOneById(post.id)
        const postDomain = PostMapper.toDomain(postInstance)
        return postDomain
    }
}