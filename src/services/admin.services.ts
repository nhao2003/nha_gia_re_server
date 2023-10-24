import { Equal, Repository } from 'typeorm';
import { PostStatus, UserStatus } from '~/constants/enum';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { User } from '~/domain/databases/entity/User';
import { MyRepository } from '~/repositories/my_repository';

class AdminService {
  private userRepo: Repository<User>;
  private postRepo: Repository<RealEstatePost>;
  constructor() {
    this.userRepo = MyRepository.userRepository();
    this.postRepo = MyRepository.postRepository();
  }
  // post approval
  async getPostApproval(page: number, postWhere: string[], order: any, userWhere: string[] | null) {
    page = page || 1;
    let query = this.postRepo
      .createQueryBuilder()
      .leftJoinAndSelect('RealEstatePost.user', 'user')
      .orderBy(order)
      .skip((page - 1) * 10)
      .take(10);

    postWhere.forEach((item: string) => {
      query = query.andWhere(`RealEstatePost.${item}`);
    });

    if (userWhere) {
      userWhere.forEach((item: string) => {
        query = query.andWhere(`user.${item}`);
      });
    }

    const getSql = query.getSql();
    console.log(getSql);
    const posts = await query.getMany();
    return posts;
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
