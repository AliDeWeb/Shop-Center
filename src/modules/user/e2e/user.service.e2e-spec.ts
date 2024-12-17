import mongoose from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../user.service';
import { UserModule } from '../user.module';
import { UserRepository } from '../repo/user.repository';
import { User, UserSchema } from '../entities/user.entity';
import { testDBUri } from '../../../../test/test-utils';

describe('UserService (e2e)', () => {
  let service: UserService;
  let newUserId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    const uri = testDBUri;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        UserModule,
      ],
      providers: [UserService, UserRepository],
    }).compile();

    service = module.get<UserService>(UserService);
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should create and get a new user', async () => {
    const userDto = {
      name: 'Ali',
      username: 'AliDeWeb',
      email: 'alimoradi0business@gmail.com',
      password: '12345678',
    };
    const newUser = await service.createUser(userDto);
    newUserId = newUser._id;
    expect(newUser).toBeDefined();
    expect(newUser.name).toBe(userDto.name);

    // @ts-ignore
    const fetchedUser = await service.getUserById(newUser._id);
    expect(fetchedUser).toBeDefined();
    expect(fetchedUser.email).toBe(userDto.email);
  });
  it('should update a user and return the result', async () => {
    const newName = 'John';

    // @ts-ignore
    const updatedUser = await service.updateUser(newUserId, { name: newName });

    expect(updatedUser).toBeDefined();
    expect(updatedUser.name).toBe(newName);
  });
  it('should delete a user', async () => {
    // @ts-ignore
    const result = await service.deleteUserById(newUserId);
    expect(result).toBeUndefined();
  });
});
