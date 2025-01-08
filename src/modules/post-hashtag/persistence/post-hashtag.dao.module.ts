import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PostHashtagEntity } from "./post-hashtag.entity";
import { PostHashtagDaoService } from "./post-hashtag.dao.service";

@Module({
    imports: [MikroOrmModule.forFeature([PostHashtagEntity])],
    providers: [PostHashtagDaoService],
    exports: [PostHashtagDaoService],
})
export class PostHashtagDaoModule{}