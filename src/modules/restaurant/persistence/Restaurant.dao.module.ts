import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { RestaurantEntity } from "./Restaurant.entity";
import { RestaurantDaoService } from "./Restaurant.dao.service";

@Module({
    imports: [MikroOrmModule.forFeature([RestaurantEntity])],
    controllers: [],
    providers: [RestaurantDaoService],
    exports: [RestaurantDaoService]
})
export class RestaurantDaoModule{}