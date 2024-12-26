import { Body, Controller, Post, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreatePostRequestDto } from "./dto/create-post-request.dto";
import { PostService } from "./post.service";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { FILE_UPLOADS_DIR, POST_MEDIA_UPLOADS_DIR } from "src/constants";
import { fileNameEditor, mediaFileFilter } from "src/utils/image.utils";
import { AuthGuard } from "src/module/AuthGuard/AuthGuard.service";

@Controller('post')
export class PostController{
    constructor(private readonly postService: PostService){}

    @Post('/')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FilesInterceptor('medias', 5, {
            storage: diskStorage({
                destination: POST_MEDIA_UPLOADS_DIR,
                filename: fileNameEditor
            }),
            fileFilter: mediaFileFilter,
            limits: {
                fieldSize: 1000 * 1000 * 10
            }
        })
    )
    async createPost(@Body() data: CreatePostRequestDto, @UploadedFiles() medias: Express.Multer.File[], @Request() req){
        return await this.postService.createPost(req.user, data, medias)
    }
}