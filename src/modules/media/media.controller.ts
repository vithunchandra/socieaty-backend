import { Controller, Get, Param, StreamableFile } from '@nestjs/common'
import { createReadStream } from 'fs'
import { join } from 'path'
import constants from '../../constants'

@Controller('files')
export class MediaController {
	@Get('post/videos/:fileName')
	getFile(@Param('fileName') fileName: string): StreamableFile {
		const file = createReadStream(join(constants().POST_MEDIA_UPLOADS_DIR, 'videos', fileName))

		return new StreamableFile(file)
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
