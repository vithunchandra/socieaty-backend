import { join } from 'path'

export const BASE_URL = 'http://192.168.200.205:3000/'
// export const BASE_URL = 'http://192.168.41.142:3000/'
// export const BASE_URL = 'https://massive-dominant-grubworm.ngrok-free.app/'

export const FILE_UPLOADS_DIR = join(process.cwd(), 'src', 'files')

export const POST_MEDIA_UPLOADS_DIR = join(process.cwd(), 'src', 'files', 'post')
export const POST_MEDIA_RELATIVE_DIR = 'files/post'

export const RESTAURANT_BANNER_UPLOADS_DIR = join(
	process.cwd(),
	'src',
	'files',
	'user',
	'restaurant_banner'
)
export const RESTAURANT_BANNER_RELATIVE_DIR = 'files/user/restaurant_banner'

export const PROFILE_PICTURE_UPLOADS_DIR = join(
	process.cwd(),
	'src',
	'files',
	'user',
	'profile_picture'
)
export const PROFILE_PICTURE_RELATIVE_DIR = 'files/user/profile_picture'

export const RESTAURANT_MENU_UPLOADS_DIR = join(process.cwd(), 'src', 'files', 'menu')
export const RESTAURANT_MENU_RELATIVE_DIR = 'files/menu'

export const SERVICE_FEE = 5000
