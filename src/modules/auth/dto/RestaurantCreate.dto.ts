import { Type } from "class-transformer";
import { IsDefined, IsEmail, IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import { Point } from "src/modules/restaurant/persistence/custom-type/PointType";
import { UserRole } from "src/modules/user/persistance/User.entity";

export class RestaurantCreateDto{
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsString()
    confirmPassword: string

    @IsNotEmpty()
    @IsString()
    phoneNumber: string

    @IsNotEmpty()
    @IsString()
    role: UserRole

    @IsNotEmpty()
    @IsString()
    restaurantName: string

    @ValidateNested()
    @Type(() => Point)
    @IsObject()
    address: Point
}