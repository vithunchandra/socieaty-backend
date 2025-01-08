import { Factory } from "@mikro-orm/seeder";
import { RestaurantEntity } from "../../modules/restaurant/persistence/Restaurant.entity";
import { Constructor, EntityData } from "@mikro-orm/core";
import { faker } from '@faker-js/faker';
import { Point } from "../../modules/restaurant/persistence/custom-type/PointType";

export class RestaurantFactory extends Factory<RestaurantEntity> {
    model: Constructor<RestaurantEntity> = RestaurantEntity;
    protected definition(): EntityData<RestaurantEntity> {
        return {
            location: new Point(faker.location.latitude(), faker.location.longitude()),
            photoUrl: "",
        }
    }

}