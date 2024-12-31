import { removeFiles } from './removeFiles.util';
import { promises as fs } from 'fs';
import { NotFoundException } from '@nestjs/common';

describe('removeFiles', () => {
  it('should remove files if they exist', async () => {
    jest.spyOn(fs, 'unlink').mockResolvedValue(undefined);

    const result = await removeFiles(['files path']);

    expect(result).toBeUndefined();
    expect(fs.unlink).toHaveBeenCalledTimes(1);
  });

  it('should throw err if files dont exist', async () => {
    jest.spyOn(fs, 'unlink').mockRejectedValue(new Error('File not found'));

    expect(removeFiles(['nonexistentFile.txt'])).rejects.toThrowError(
      NotFoundException,
    );
  });
});
