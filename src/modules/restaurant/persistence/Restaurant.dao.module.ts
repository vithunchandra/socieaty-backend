import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { RestaurantEntity } from "./Restaurant.entity";
import { RestaurantDaoService } from "./Restaurant.dao.service";
import { RestaurantThemeEntity } from "./restaurant-theme.entity";

@Module({
    imports: [MikroOrmModule.forFeature([RestaurantEntity, RestaurantThemeEntity])],
    controllers: [],
    providers: [RestaurantDaoService],
    exports: [RestaurantDaoService]
})
export class RestaurantDaoModule{}