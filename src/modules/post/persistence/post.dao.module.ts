import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { PostEntity } from "./post.entity";
import { PostDaoService } from "./post.dao.service";

@Module({
    imports: [MikroOrmModule.forFeature([PostEntity])],
    providers: [PostDaoService],
    exports: [PostDaoService]
})
export class PostDaoModule{}