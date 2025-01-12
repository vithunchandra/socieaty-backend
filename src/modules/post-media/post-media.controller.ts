import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { POST_MEDIA_UPLOADS_DIR } from '../../constants';

@Controller('file/post')
export class PostMediaController {
  @Get('/video/:fileName')
  getFile(@Param('fileName') fileName: string): StreamableFile {
    const file = createReadStream(join(POST_MEDIA_UPLOADS_DIR, 'videos', fileName));
    return new StreamableFile(file);
  }

  @Get('/image/:fileName')
  getImage(@Param('fileName') fileName: string): StreamableFile {
    const file = createReadStream(join(POST_MEDIA_UPLOADS_DIR, 'images', fileName));
    return new StreamableFile(file);
  }
}