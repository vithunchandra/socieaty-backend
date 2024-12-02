import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { UserEntity } from "./User.entity";
import { UserDaoService } from "./User.dao.service";

@Module({
    imports: [MikroOrmModule.forFeature({entities: [UserEntity]})],
    controllers: [],
    providers: [UserDaoService],
    exports: [UserDaoService]
})
export class UserDaoModule{}