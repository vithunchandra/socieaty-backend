import { BadRequestException } from "@nestjs/common";
import { Request } from "express"

export const fileNameEditor = (
    req: Request, 
    file: Express.Multer.File, 
    callback: (error: Error | null, name: string) => void
) => {
    const extension = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
    const fileName = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
    let newFileName = "";
    console.log(fileName)
    if(extension.match(/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/)){
        newFileName = `video_${fileName}_${Date.now()}.${extension}`;
    }else{
        newFileName = `image_${fileName}_${Date.now()}.${extension}`;
    }
    callback(null, newFileName);
}

export const imageFileFilter = (
    req: Request, 
    file: Express.Multer.File, 
    callback: (error: Error | null, valid: boolean) => void
) => {
    if(
        !file.originalname ||
        !file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)
    ){
        return callback(
            new BadRequestException('File must be of type jpg|jpeg|png|gif|svg|webp'),
            false
        )
    }

    return callback(null, true);
}

export const mediaFileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, valid: boolean) => void
) => {
    if(!file.originalname){
        return callback(
            new BadRequestException('Media must exist'),
            false
        )
    }
    if(!file.originalname.match(/\.(mp4|webm|ogg|mp3|wav|flac|aac|jpg|jpeg|png|gif|svg|webp)$/)){
        return callback(
            new BadRequestException('File must be of type mp4|webm|ogg|mp3|wav|flac|aac'),
            false
        )
    }
    return callback(null, true);
}