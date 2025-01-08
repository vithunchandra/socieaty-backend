import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { MediaDaoService } from "./post-media.dao.service";
import { PostMediaEntity } from "./post-media.entity";

@Module({
    imports: [MikroOrmModule.forFeature([PostMediaEntity])],
    providers: [MediaDaoService],
    exports: [MediaDaoService]
})
export class MediaDaoModule{}