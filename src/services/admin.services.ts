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
  async getPostApproval(page: number,where: any, order: any) {
    page = page || 1;
    let query = this.postRepo
      .createQueryBuilder()
      // .where(where)
      // .where('RealEstatePost.status = :status', { status: PostStatus.pending })
      // // .andWhere('RealEstatePost.address ->> \'province_code\' = :province_code', { province_code: 2 })
      // // .andWhere('RealEstatePost.address ->> \'province_code\' BETWEEN \'2\' AND \'3\'')
      // .andWhere('RealEstatePost.address ->> \'province_code\' IN (\'2\', \'3\')')
      .leftJoinAndSelect('RealEstatePost.user', 'user')
      .orderBy(order)
      .skip((page - 1) * 10)
      .take(10);

    where.forEach((item: string) => {
      query = query.andWhere(`RealEstatePost.${item}`);
    });

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
