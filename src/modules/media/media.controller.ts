import { Controller, Get, Param, Req, Res, StreamableFile } from '@nestjs/common'
import { createReadStream, statSync } from 'fs'
import { join } from 'path'
import constants from '../../constants'
import { Request, Response } from 'express'

@Controller('files')
export class MediaController {
	@Get('post/videos/:fileName')
	async getFile(@Param('fileName') fileName: string, @Req() req: Request, @Res() res: Response) {
		const filePath = join(constants().POST_MEDIA_UPLOADS_DIR, 'videos', fileName)
		const stat = statSync(filePath)
		const fileSize = stat.size
		const range = req.headers.range

		if (range) {
			const parts = range.replace(/bytes=/, '').split('-')
			const start = parseInt(parts[0], 10)
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

			const chunkSize = end - start + 1
			const file = createReadStream(filePath, { start, end })

			res.writeHead(206, {
				'Content-Range': `bytes ${start}-${end}/${fileSize}`,
				'Accept-Ranges': 'bytes',
				'Content-Length': chunkSize,
				'Content-Type': 'video/mp4'
			})

			file.pipe(res)
		} else {
			res.writeHead(200, {
				'Content-Length': fileSize,
				'Content-Type': 'video/mp4',
				'Accept-Ranges': 'bytes'
			})

			createReadStream(filePath).pipe(res)
		}
	}

	@Get('post/images/:fileName')
	getImage(@Param('fileName') fileName: string): StreamableFile {
		const file = createReadStream(join(constants().POST_MEDIA_UPLOADS_DIR, 'images', fileName))
		return new StreamableFile(file)
	}

	@Get('post/videos/dummy/:fileName')
	getDummyVideo(@Param('fileName') fileName: string): StreamableFile {
		const file = createReadStream(
			join(constants().POST_MEDIA_UPLOADS_DIR, 'videos', 'dummy', fileName)
		)
		return new StreamableFile(file)
	}

	@Get('post/images/dummy/:fileName')
	getDummyImage(@Param('fileName') fileName: string): StreamableFile {
		const file = createReadStream(
			join(constants().POST_MEDIA_UPLOADS_DIR, 'images', 'dummy', fileName)
		)
		return new StreamableFile(file)
	}

	@Get('post/thumbnails/:fileName')
	getPostThumbnail(@Param('fileName') fileName: string): StreamableFile {
		const file = createReadStream(
			join(constants().POST_MEDIA_UPLOADS_DIR, 'thumbnails', fileName)
		)
		return new StreamableFile(file)
	}

	@Get('post/thumbnails/dummy/:fileName')
	getDummyPostThumbnail(@Param('fileName') fileName: string): StreamableFile {
		const file = createReadStream(
			join(constants().POST_MEDIA_UPLOADS_DIR, 'thumbnails', 'dummy', fileName)
		)
		return new StreamableFile(file)
	}

	//   @Get('restaurant/banner/:fileName')
	//   getRestaurantBanner(@Param('fileName') fileName: string): StreamableFile {
	//     const file = createReadStream(join(RESTAURANT_MEDIA_UPLOADS_DIR, 'banner', fileName));
	//     return new StreamableFile(file);
	//   }

	//   @Get('restaurant/banner/dummy/:fileName')
	//   getDummyRestaurantBanner(@Param('fileName') fileName: string): StreamableFile {
	//     const file = createReadStream(join(RESTAURANT_MEDIA_UPLOADS_DIR, 'banner', 'dummy', fileName));
	//     return new StreamableFile(file);
	//   }

	@Get('menu/dummy/:fileName')
	getDummyMenu(@Param('fileName') fileName: string): StreamableFile {
		const file = createReadStream(
			join(constants().RESTAURANT_MENU_UPLOADS_DIR, 'dummy', fileName)
		)
		return new StreamableFile(file)
	}

	@Get('menu/:fileName')
	getMenu(@Param('fileName') fileName: string): StreamableFile {
		const file = createReadStream(join(constants().RESTAURANT_MENU_UPLOADS_DIR, fileName))
		return new StreamableFile(file)
	}

	@Get('user/restaurant_banner/:fileName')
	getRestaurantBanner(@Param('fileName') fileName: string): StreamableFile {
		const file = createReadStream(join(constants().RESTAURANT_BANNER_UPLOADS_DIR, fileName))
		return new StreamableFile(file)
	}

	@Get('user/restaurant_banner/dummy/:fileName')
	getDummyRestaurantBanner(@Param('fileName') fileName: string): StreamableFile {
		const file = createReadStream(
			join(constants().RESTAURANT_BANNER_UPLOADS_DIR, 'dummy', fileName)
		)
		return new StreamableFile(file)
	}

	@Get('user/profile_picture/:fileName')
	getUserProfilePicture(@Param('fileName') fileName: string): StreamableFile {
		const file = createReadStream(join(constants().PROFILE_PICTURE_UPLOADS_DIR, fileName))
		return new StreamableFile(file)
	}

	@Get('user/profile_picture/dummy/:fileName')
	getDummyUserProfilePicture(@Param('fileName') fileName: string): StreamableFile {
		const file = createReadStream(
			join(constants().PROFILE_PICTURE_UPLOADS_DIR, 'dummy', fileName)
		)
		return new StreamableFile(file)
	}
}
