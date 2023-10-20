import { Repository } from 'typeorm';
import { PostStatus } from '~/constants/enum';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { MyRepository } from '~/repositories/my_repository';

class PostServices {
  postRepository: Repository<RealEstatePost>;
  constructor() {
    this.postRepository = MyRepository.postRepository();
  }
  async createPost(data: Record<string, any>) {
    data = {
      ...data,
      status: PostStatus.pending,
    };
    await this.postRepository.insert(data);
    return data;
  }

  async getPost(id: any): Promise<RealEstatePost | undefined | null> {
    const post = await this.postRepository.findOne(id);
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

  async getPosts() {
    return [];
  }

  async getPostsByUser(user_id: any) {
    return user_id;
  }

  async getPostsByProject(project_id: any) {
    return project_id;
  }

  async getPostsByType(type_id: any) {
    return type_id;
  }
}

export default new PostServices();
