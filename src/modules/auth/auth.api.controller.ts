import { Body, Controller, Get, Post, Request, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserSigninDto } from "./dto/user-signin.dto";
import { RestaurantCreateDto } from "./dto/RestaurantCreate.dto";
import { CustomerCreateDto } from "./dto/CustomerCreate.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { FILE_UPLOADS_DIR } from "src/constants";
import { fileNameEditor, imageFileFilter } from "src/utils/image.utils";
import { AuthService } from "./auth.api.service";
import { AuthGuard } from "src/module/AuthGuard/AuthGuard.service";

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
                filename: fileNameEditor
            }),
            fileFilter: imageFileFilter,
            limits: {
                fieldSize: 1000 * 1000 * 10
            }
        })
    )
    async restaurantSignup(@Body() data: RestaurantCreateDto, @UploadedFile() image: Express.Multer.File){
        return await this.authService.restaurantSignup(data, image)
    }

    @Post('signin')
    async signin(@Body() data: UserSigninDto){
        return await this.authService.signin(data)
    }
    
    @UseGuards(AuthGuard)
    @Get('session/data')
    async getData(@Request() req){
        return this.authService.getData(req.user.id)
    }
}