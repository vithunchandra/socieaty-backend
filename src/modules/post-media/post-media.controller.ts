import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { POST_MEDIA_UPLOADS_DIR } from '../../constants';

@Controller('files/post')
export class PostMediaController {
  @Get('/videos/:fileName')
  getFile(@Param('fileName') fileName: string): StreamableFile {
    const file = createReadStream(join(POST_MEDIA_UPLOADS_DIR, 'videos', fileName));
    return new StreamableFile(file);
  }

  @Get('/images/:fileName')
  getImage(@Param('fileName') fileName: string): StreamableFile {
    const file = createReadStream(join(POST_MEDIA_UPLOADS_DIR, 'images', fileName));
    return new StreamableFile(file);
  }

  @Get('/videos/dummy/:fileName')
  getDummyVideo(@Param('fileName') fileName: string): StreamableFile {
    const file = createReadStream(join(POST_MEDIA_UPLOADS_DIR, 'videos', 'dummy', fileName));
    return new StreamableFile(file);
  }

  @Get('/images/dummy/:fileName')
  getDummyImage(@Param('fileName') fileName: string): StreamableFile {
    const file = createReadStream(join(POST_MEDIA_UPLOADS_DIR, 'images', 'dummy', fileName));
    return new StreamableFile(file);
  }


}