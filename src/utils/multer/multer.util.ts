import multer, { Options } from 'multer';
import { getEnv } from '../getEnv/getEnvs.util';
import e from 'express';
import { Error } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

const allowedFileTypes = {
  image: {
    name: 'image',
    types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  },
};
enum allowedCategories {
  products,
}

export const multerOptions: (
  category: allowedCategories,
  fileType: keyof typeof allowedFileTypes,
  maxFileSize: number,
) => Options = (category, fileType, maxFileSize) => ({
  storage: multer.diskStorage({
    destination: `${getEnv('MULTER_DEST')}/${category}/${fileType}`,
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
});
