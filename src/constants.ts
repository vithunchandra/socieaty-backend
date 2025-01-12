import { join } from "path";

// export const BASE_URL = "http://192.168.80.142:3000/"
export const BASE_URL = "http://192.168.200.205:3000/"

export const FILE_UPLOADS_DIR = join(process.cwd(), 'src', 'files')
export const POST_MEDIA_UPLOADS_DIR = join(process.cwd(), 'src', 'files', 'post');