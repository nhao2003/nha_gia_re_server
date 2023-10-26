import { FindManyOptions, MoreThanOrEqual, Repository } from 'typeorm';
import { PostStatus, UserStatus } from '~/constants/enum';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { PostQuery } from '~/models/PostQuery';
import { MyRepository } from '~/repositories/my_repository';
import { buildOrder, buildQuery } from '~/utils/build_query';
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
  async updatePost(id: string, data: any): Promise<any> {
    data = {
      ...data,
    };
    const result = await this.postRepository.update(id, data);
    return result;
  }

  async deletePost(id: string) {
    await this.postRepository.update(id, { is_active: false });
    return id;
  }

  async getPosts(page: number) {
    page = page || 1;
    const query = this.postRepository
      .createQueryBuilder()
      .skip((page - 1) * 10)
      .take(10)
      .addOrderBy('RealEstatePost.posted_date', 'DESC')
      .andWhere('expiry_date >= :expiry_date', { expiry_date: new Date() })
      .andWhere('RealEstatePost.is_active = :is_active', { is_active: true })
      .leftJoinAndSelect('RealEstatePost.user', 'user')
      .andWhere('user.status = :status', { status: UserStatus.not_update });
    const getSql = query.getSql();
    console.log(getSql);
    const posts = await query.getMany();

    return posts;
  }

  buildPostQuery(query: { [key: string]: any }): PostQuery {
    const { page, sort_fields, sort_orders } = query;
    const pageParam = Number(page) || 1;

    const postQueries: {
      [key: string]: string;
    } = {};

    const userQueries: {
      [key: string]: string;
    } = {};

    Object.keys(query)
      .filter((key) => key.startsWith('post.'))
      .forEach((key) => {
        postQueries[key.replace('post.', '')] = query[key] as string;
      });

    Object.keys(query)
      .filter((key) => key.startsWith('user.'))
      .forEach((key) => {
        userQueries[key.replace('user.', '')] = query[key] as string;
      });

    const postWhere: string[] = buildQuery(postQueries, ['address', 'features']);
    const userWhere: string[] = buildQuery(userQueries, ['address']);

    const order = buildOrder(sort_fields, sort_orders, 'RealEstatePost');

    return {
      page: pageParam,
      postWhere,
      userWhere,
      order,
    };
  }

  async getPostsByQuery(postQuery: PostQuery, user_id: string | null = null) {
    const page = postQuery.page || 1;
    let query = this.postRepository
      .createQueryBuilder()
      .leftJoinAndSelect('RealEstatePost.user', 'user')
      .orderBy(postQuery.order)
      .skip((page - 1) * 10)
      .take(10);

    if (postQuery.postWhere) {
      postQuery.postWhere.forEach((item: string) => {
        query = query.andWhere(`RealEstatePost.${item}`);
      });
    }
    if (postQuery.userWhere) {
      postQuery.userWhere.forEach((item: string) => {
        query = query.andWhere(`user.${item}`);
      });
    }
    if (user_id) {
      //Check if user has liked the post. Set is_liked = true if yes and false if no
      query = query.leftJoinAndMapOne(
        'RealEstatePost.is_liked',
        'RealEstatePost.likes',
        'likes',
        'likes.user_id = :user_id',
        {
          user_id,
        },
      );
    }

    const getSql = query.getSql();
    console.log(getSql);
    const posts = await query.getMany();
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

  async checkPostExist(id: string) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });
    return post;
  }
}

export default new PostServices();
