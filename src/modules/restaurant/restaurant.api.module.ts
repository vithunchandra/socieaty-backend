import { Module } from "@nestjs/common";
import { RestaurantDaoModule } from "src/modules/restaurant/persistence/Restaurant.dao.module";
import { RestaurantController } from "./restaurant.api.controller";
import { RestaurantService } from "./restaurant.api.service";
import { UserDaoModule } from "../user/persistance/User.dao.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [RestaurantDaoModule, UserDaoModule, JwtModule.register({
        secret: process.env.AUTH_SECRET_KEY,
        signOptions: { expiresIn: '300s' },
    })],
    providers: [RestaurantService],
    controllers: [RestaurantController],
    exports: [RestaurantService]
})
export class RestaurantModule{}