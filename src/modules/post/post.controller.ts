import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Put,
	Query,
	Request,
	UploadedFile,
	UploadedFiles,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { CreatePostRequestDto } from './dto/create-post-request.dto'
import { PostService } from './post.service'
import { FilesInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { FILE_UPLOADS_DIR, POST_MEDIA_UPLOADS_DIR } from 'src/constants'
import { fileDestination, fileNameEditor, mediaFileFilter } from 'src/utils/image.utils'
import { AuthGuard } from 'src/module/AuthGuard/AuthGuard.service'
import { LikePostRequestDto } from './dto/like-post-request.dto'
import { GetPaginatedPostQueryRequestDto } from './dto/get-paginated-post-query.request.dto'
import { UpdatePostRequestDto } from './dto/update-post-request.dto'

@Controller('post')
export class PostController {
	constructor(private readonly postService: PostService) {}

	@Post('/')
	@UseGuards(AuthGuard)
	@UseInterceptors(
		FilesInterceptor('medias', 5, {
			storage: diskStorage({
				destination: fileDestination,
				filename: fileNameEditor
			}),
			fileFilter: mediaFileFilter,
			limits: {
				fieldSize: 1024 * 1024 * 10
			}
		})
	)
	async createPost(
		@Body() data: CreatePostRequestDto,
		@UploadedFiles() medias: Express.Multer.File[],
		@Request() req
	) {
		return await this.postService.createPost(req.user, data, medias)
	}

	@Get('/')
	@UseGuards(AuthGuard)
	async getAllPosts() {
		return await this.postService.getAllPosts()
	}

	@Get('/paginate')
	@UseGuards(AuthGuard)
	async getPaginatedPosts(@Query() query: GetPaginatedPostQueryRequestDto) {
		return await this.postService.getPaginatedPosts(query)
	}

	@Put(':postId')
	@UseGuards(AuthGuard)
	@UseInterceptors(
		FilesInterceptor('medias', 5, {
			storage: diskStorage({
				destination: fileDestination,
				filename: fileNameEditor
			}),
			fileFilter: mediaFileFilter,
			limits: {
				fieldSize: 1024 * 1024 * 10
			}
		})
	)
	async updatePost(
		@Param('postId') postId: string,
		@Body() data: UpdatePostRequestDto,
		@UploadedFiles() medias: Express.Multer.File[]
	) {
		return await this.postService.updatePost(postId, data, medias)
	}

	@Get('/:postId')
	@UseGuards(AuthGuard)
	async getPostById(@Param('postId') postId: string) {
		return await this.postService.getPostById(postId)
	}

	@Put(':postId/like')
	@UseGuards(AuthGuard)
	async likePost(
		@Request() req,
		@Param('postId') postId: string,
		@Body() data: LikePostRequestDto
	) {
		return await this.postService.likePost(postId, req.user.id, data.isLiked)
	}	
}
