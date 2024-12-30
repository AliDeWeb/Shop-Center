import { promises as fs } from 'fs';
import { NotFoundException } from '@nestjs/common';

export const removeFiles = async (paths: string[]) => {
  for (const file of paths) {
    try {
      await fs.unlink(file);
    } catch (err) {
      throw new NotFoundException('file not found');
    }
  }
};
