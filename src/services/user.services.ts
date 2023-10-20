import { Repository } from 'typeorm/browser';
import { User } from '~/domain/databases/entity/User';
import { MyRepository } from '~/repositories/my_repository';

class UserServices {
  private userRepository: Repository<User>;
  constructor() {
    this.userRepository = MyRepository.userRepository();
  }
  async updateUserInfo(user_id: string, data: any): Promise<boolean> {

    await this.userRepository.update({ id: user_id }, {
      ...data,
      updated_at: new Date(),
    });
    return true;
  }

  async getUserInfo(id: string, is_active: boolean = true): Promise<User | null> {
    const user = await this.userRepository.findOne({where: {id, is_active}});
    return user;
  }
}

export default new UserServices();
