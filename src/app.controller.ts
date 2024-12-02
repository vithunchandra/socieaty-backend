import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter, imageFileNameEditor } from './utils/image.utils';
import { CreateFileDto } from './dto/create-file.dto';
import { join } from 'path';
import { FILE_UPLOADS_DIR } from './constants';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: FILE_UPLOADS_DIR,
        filename: imageFileNameEditor
      }),
      fileFilter: imageFileFilter,
      limits: {
        fieldSize: 1000 * 1000 * 10
      }
    })
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateFileDto
  ){
    console.log(join(process.cwd(), 'src', 'files'));
    console.log(file);
    return{
      filename: file.filename,
      size: file.buffer,
      description: dto.description
    }
  }
}
