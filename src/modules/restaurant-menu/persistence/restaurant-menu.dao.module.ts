import { Module } from "@nestjs/common";
import { MenuTypeEntity } from "./menu-type.entity";
import { RestaurantMenuEntity } from "./restaurant-menu.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { RestaurantMenuDaoService } from "./restaurant-menu.dao.service";

@Module({
    imports: [MikroOrmModule.forFeature([RestaurantMenuEntity, MenuTypeEntity])],
    providers: [RestaurantMenuDaoService],
    exports: [RestaurantMenuDaoService]
})
export class RestaurantMenuDaoModule {}