import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "src/modules/user/persistance/User.entity";

export class CustomerCreateDto{
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
    name: string
}