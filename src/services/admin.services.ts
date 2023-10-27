import { Equal, Repository } from 'typeorm';
import { PostStatus, UserStatus } from '~/constants/enum';
import { Developer } from '~/domain/databases/entity/Developer';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { User } from '~/domain/databases/entity/User';
import { BaseQuery, PostQuery } from '~/models/PostQuery';
import CreateDeveloper from '~/models/Request/CreateDeveloper';
import { MyRepository } from '~/repositories/my_repository';

class AdminService {
  private userRepo: Repository<User>;
  private postRepo: Repository<RealEstatePost>;
  developerRepo: Repository<Developer>;
  constructor() {
    this.userRepo = User.getRepository();
    this.postRepo = RealEstatePost.getRepository();
    this.developerRepo = Developer.getRepository();
  }

  async approvePost(id: string) {
    await this.postRepo.update(id, { status: PostStatus.approved, info_message: null });
    return id;
  }

  async rejectPost(id: string, reason: string) {
    await this.postRepo.update(id, { status: PostStatus.rejected, info_message: reason });
    return id;
  }

  // Delete post
  async deletePost(id: string) {
    await this.postRepo.update(id, { is_active: false });
    return id;
  }
}

export default new AdminService();
