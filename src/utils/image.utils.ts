import { BadRequestException } from "@nestjs/common";
import { Request } from "express"

export const imageFileNameEditor = (
    req: Request, 
    file: Express.Multer.File, 
    callback: (error: Error, name: string) => void
) => {
    const newFileName = `image_${file.originalname}`;
    callback(null, newFileName);
}

export const imageFileFilter = (
    req: Request, 
    file: Express.Multer.File, 
    callback: (error: Error, valid: boolean) => void
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