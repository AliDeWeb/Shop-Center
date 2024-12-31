import { promises as fs } from 'fs';
import { NotFoundException } from '@nestjs/common';
import { path } from '../multer/multer.util';

const filesRoot: string = path.split('/')[0];

export const removeFiles = async (paths: string[]) => {
  for (const file of paths) {
    try {
      await fs.unlink(`${filesRoot}/${file}`);
    } catch (err) {
      throw new NotFoundException('file not found');
    }
  }
};
