import { join } from 'path'

export default () => {
	const FileUploadsDir = join(process.env.STORAGE_PATH ?? '', 'files')
	console.log(join(FileUploadsDir, 'user', 'profile_picture'))

	return {
		// export const BASE_URL = 'http://192.168.200.194:3000/',
		// export const BASE_URL = 'http://192.168.247.142:3000/',
		// BASE_URL: 'https://massive-dominant-grubworm.ngrok-free.app/',
		// export const BASE_URL = 'https://socieaty.share.zrok.io/',
		BASE_URL: process.env.BASE_URL ?? 'http://35.219.33.128/',

		FILE_UPLOADS_DIR: FileUploadsDir,

		POST_MEDIA_UPLOADS_DIR: join(FileUploadsDir, 'post'),
		POST_MEDIA_RELATIVE_URL: 'files/post',

		RESTAURANT_BANNER_UPLOADS_DIR: join(FileUploadsDir, 'user', 'restaurant_banner'),
		RESTAURANT_BANNER_RELATIVE_URL: 'files/user/restaurant_banner',

		PROFILE_PICTURE_UPLOADS_DIR: join(FileUploadsDir, 'user', 'profile_picture'),
		PROFILE_PICTURE_RELATIVE_URL: 'files/user/profile_picture',

		RESTAURANT_MENU_UPLOADS_DIR: join(FileUploadsDir, 'menu'),
		RESTAURANT_MENU_RELATIVE_URL: 'files/menu',

		SERVICE_FEE: 5000,

		ADMIN_EMAIL: 'admin@socieaty.com',
		ADMIN_PASSWORD: 'admin'
	}
}
