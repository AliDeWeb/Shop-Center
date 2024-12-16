import { getEnv } from './getEnvs.util';

describe('getEnvs', () => {
  it('should return the value of PORT if defined', () => {
    process.env.PORT = '3000';
    expect(getEnv('PORT')).toBe('3000');
  });

  it('should throw an error if PORT is not defined', () => {
    delete process.env.PORT;
    expect(() =>
      getEnv('PORT'),
    ).toThrow('Env PORT not defined');
  });
});
