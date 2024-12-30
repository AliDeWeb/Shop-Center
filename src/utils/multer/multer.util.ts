import multer, { diskStorage, Options } from 'multer';
import e from 'express';
import { Error } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

const path = 'statics/uploads';
const allowedFileTypes = {
  image: {
    name: 'image',
    types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
};
type allowedCategories = 'products';

export const multerOptions: (
  category: allowedCategories,
  fileType: keyof typeof allowedFileTypes,
  maxFileSize: number,
) => { option: Options; path: string } = (
  category: allowedCategories,
  fileType: keyof typeof allowedFileTypes,
  maxFileSize: number,
) => {
  return {
    path: `${path.split('/')[1]}/${category}/${fileType}`,
    option: {
      storage: diskStorage({
        destination: `${path}/${category}/${fileType}`,
        filename(
          req: e.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const uniqueName = `${category}-${fileType}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
          const ext = file.originalname.split('.').pop();
          callback(null, `${uniqueName}.${ext}`);
        },
      }),
      fileFilter(
        req: e.Request,
        file: Express.Multer.File,
        callback: multer.FileFilterCallback,
      ) {
        if (!allowedFileTypes[fileType].types.includes(file.mimetype))
          callback(new BadRequestException('invalid file type'));

        callback(null, true);
      },
      limits: {
        fileSize: maxFileSize * 1024 * 1024,
      },
    },
  };
};
