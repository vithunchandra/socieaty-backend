import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { MediaDaoService } from "./media.dao.service";
import { PostMediaEntity } from "./media.entity";

@Module({
    imports: [MikroOrmModule.forFeature([PostMediaEntity])],
    providers: [MediaDaoService],
    exports: [MediaDaoService]
})
export class MediaDaoModule{}