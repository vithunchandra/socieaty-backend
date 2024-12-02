import { Body, Controller, Get, Post, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserSigninDto } from "./dto/UserSignin.dto";
import { AuthGuard } from "src/module/AuthGuard/AuthGuard";
import { RestaurantCreateDto } from "./dto/RestaurantCreate.dto";
import { CustomerCreateDto } from "./dto/CustomerCreate.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { FILE_UPLOADS_DIR } from "src/constants";
import { imageFileFilter, imageFileNameEditor } from "src/utils/image.utils";
import { AuthService } from "./auth.api.service";

@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}
    
    @Post('signup/customer')
    async customerSignup(@Body() data: CustomerCreateDto){
        return await this.authService.customerSignup(data)
    }

    @Post('signup/restaurant')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: FILE_UPLOADS_DIR,
                filename: imageFileNameEditor
            }),
            fileFilter: imageFileFilter,
            limits: {
                fieldSize: 1000 * 1000 * 10
            }
        })
    )
    async restaurantSignup(@Body() data: RestaurantCreateDto, @UploadedFile() image: Express.Multer.File){
        console.log(image);
        return await this.authService.restaurantSignup(data, image)
    }

    @Post('signin')
    async signin(@Body() data: UserSigninDto){
        return {
            access_token: await this.authService.signin(data)
        }
    }
    
    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req){
        return req.user
    }
}