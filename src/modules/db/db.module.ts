import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { getEnv } from 'src/utils/getEnv/getEnvs.util';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: getEnv('DB_URL'),
      }),
    }),
  ],
})
export class DbModule {}
