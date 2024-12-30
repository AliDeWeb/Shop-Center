import { allowedCategories, multerOptions } from './multer.util';

describe('multerOptions', () => {
  it('should return multer configs and path', () => {
    const multer = multerOptions(allowedCategories.PRODUCTS, 'image', 10);

    expect(multer).toMatchObject({
      path: expect.any(String),
      option: expect.any(Object),
    });
  });
});
