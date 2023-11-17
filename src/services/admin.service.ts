import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { PostStatus } from '~/constants/enum';
import { Developer } from '~/domain/databases/entity/Developer';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { User } from '~/domain/databases/entity/User';

@Service()
class AdminService {
  private userRepo: Repository<User>;
  private postRepo: Repository<RealEstatePost>;
  developerRepo: Repository<Developer>;
  constructor(dataSource: DataSource) {
    this.userRepo = dataSource.getRepository(User);
    this.postRepo = dataSource.getRepository(RealEstatePost);
    this.developerRepo = dataSource.getRepository(Developer);
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

export default AdminService;
