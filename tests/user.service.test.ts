import { InsertResult, Repository } from 'typeorm';
import { User } from '../src/domain/databases/entity/User';
import UserSer from '../src/services/user.service';

describe('UserService', () => {
  let userService: UserSer;
  let userRepo = {
    insert: jest.fn(),
  } 

  beforeEach(() => {
    userService = new UserSer(userRepo as unknown as Repository<User> );
  });

  describe('insert', () => {
    it('should insert a user and return the result', async () => {
      const user = new User();
      const insertResult: InsertResult = {
        generatedMaps: [],
        identifiers: [],
        raw: {},
      };
      userRepo.insert = jest.fn().mockResolvedValue(insertResult);

      const result = await userService.insert(user);

      expect(userRepo.insert).toHaveBeenCalledWith(user);
      expect(result).toBe(insertResult);
    });
  });
});
