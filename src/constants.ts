import { join } from "path";

export const BASE_URL = "https://10.0.2.2:3000"
export const FILE_UPLOADS_DIR = join(process.cwd(), 'src', 'files');
export const POST_MEDIA_UPLOADS_DIR = join(process.cwd(), 'src', 'files', 'post');