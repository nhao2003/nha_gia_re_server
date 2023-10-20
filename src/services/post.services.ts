import { FindManyOptions, MoreThanOrEqual, Repository } from 'typeorm';
import { PostStatus } from '~/constants/enum';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { MyRepository } from '~/repositories/my_repository';
import { parseTimeToMilliseconds } from '~/utils/time';

class PostServices {
  postRepository: Repository<RealEstatePost>;
  constructor() {
    this.postRepository = MyRepository.postRepository();
  }
  async createPost(data: Record<string, any>) {
    data = {
      ...data,
      status: PostStatus.pending,
      //expiry_date 14 days from now
      expiry_date: new Date(Date.now() + parseTimeToMilliseconds('14d')),
      is_priority: false,
      post_approval_priority: false,
    };
    await this.postRepository.insert(data);
    return data;
  }

  async getPostById(id: any): Promise<RealEstatePost | undefined | null> {
    const post = await this.postRepository.findOne({
      where: {
        id,
        expiry_date: MoreThanOrEqual(new Date()),
        is_active: true,
      },
    });
    return post;
  }
  async updatePost(id: any, data: any) {
    data = {
      ...data,
      updated_at: new Date(),
    };

    return data;
  }

  async deletePost(id: any) {
    return id;
  }

  async getPosts(page: number) {
    //Using pagination
    const posts = await this.postRepository
      .createQueryBuilder()
      .skip((page - 1) * 10)
      .take(10)
      .addOrderBy('posted_date', 'DESC')
      .andWhere('expiry_date >= :expiry_date', { expiry_date: new Date() })
      .andWhere('is_active = :is_active', { is_active: true })
      .getMany();
    return posts;
  }

  async getPostsByUser(user_id: any, page: number) {
    const posts = await this.postRepository.query(
      `SELECT * FROM real_estate_posts WHERE user_id = '${user_id}' LIMIT 10 OFFSET ${page * 10}`,
    );
  }

  async getPostsByProject(project_id: any) {
    return project_id;
  }

  async getPostsByType(type_id: any) {
    return type_id;
  }
}

export default new PostServices();
