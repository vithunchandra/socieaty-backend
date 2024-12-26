import { EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { PostMediaEntity } from "./media.entity";
import { InjectRepository } from "@mikro-orm/nestjs";
import { CreateMediaDto } from "./dto/create-media.dto";

@Injectable()
export class MediaDaoService{
    constructor(
        @InjectRepository(PostMediaEntity)
        private readonly mediaRepository: EntityRepository<PostMediaEntity>
    ){}

    createMedia(medias: CreateMediaDto[]){
        const mediaInstances: PostMediaEntity[] = []
        for(const media of medias){
            const instance = this.mediaRepository.create(media)
            this.mediaRepository.getEntityManager().persist(instance)
            mediaInstances.push(instance)
        }
        return mediaInstances
    }
}