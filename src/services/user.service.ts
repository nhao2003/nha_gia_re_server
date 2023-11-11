import { InsertResult, Repository } from "typeorm";
import { User } from "~/domain/databases/entity/User";

class UserSer {
  constructor(private readonly userRepo: Repository<User>) {}

  async insert(user: User): Promise<InsertResult> {
    return await this.userRepo.insert(user);
  }
}

export default UserSer;