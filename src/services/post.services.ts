import { MoreThanOrEqual, Repository } from 'typeorm';
import { PostStatus, UserStatus } from '~/constants/enum';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import UserPostFavorite from '~/domain/databases/entity/UserPostFavorite';
import UserPostView from '~/domain/databases/entity/UserPostView';
import { PostQuery } from '~/models/PostQuery';
import { MyRepository } from '~/repositories/my_repository';
import { buildOrder, buildQuery } from '~/utils/build_query';
import { parseTimeToMilliseconds } from '~/utils/time';
import projectServices from './project.services';

class PostServices {
  postRepository: Repository<RealEstatePost>;
  postFavoriteRepository: Repository<UserPostFavorite>;
  postViewRepository: Repository<UserPostView>;
  constructor() {
    this.postRepository = MyRepository.postRepository();
    this.postFavoriteRepository = MyRepository.userPostFavoriteRepository();
    this.postViewRepository = MyRepository.userPostViewRepository();
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
    const project = data.project;
    if (project) {
      data.project_id = await projectServices.getOrCreateUnverifiedProject(project.id, project.project_name);
    }
    delete data.project;
    await this.postRepository.insert(data);
    return data;
  }

  async getPostById(id: any): Promise<RealEstatePost | null> {
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
    const project = data.project;
    if (project) {
      data.project_id = await projectServices.getOrCreateUnverifiedProject(project.id, project.project_name);
      await projectServices.deleteUnverifiedProject(project.id);
    }
    const result = await this.postRepository.update(id, data);
    return result;
  }

  async deletePost(id: string) {
    await this.postRepository.update(id, { is_active: false });
    return id;
  }

  buildPostQuery(query: Record<string, any>): PostQuery {
    const { page, orders, search } = query;
    const pageParam = Number(page) || 1;
    const postQueries: {
      [key: string]: any;
    } = {};

    const userQueries: {
      [key: string]: any;
    } = {};
    Object.keys(query)
      .filter((key) => key.startsWith('post_'))
      .forEach((key) => {
        postQueries[key.replace('post_', '')] = query[key];
      });

    Object.keys(query)
      .filter((key) => key.startsWith('user_'))
      .forEach((key) => {
        userQueries[key.replace('user_', '')] = query[key];
      });
    const postWhere: string[] = buildQuery(postQueries);
    const userWhere: string[] = buildQuery(userQueries);

    const order = buildOrder(orders, 'RealEstatePost');

    return {
      page: pageParam,
      postWhere,
      userWhere,
      order,
      search,
    };
  }

  async getPostsByQuery(postQuery: PostQuery, user_id: string | null = null) {
    const page = postQuery.page || 1;
    let query = this.postRepository
      .createQueryBuilder()
      .leftJoinAndSelect('RealEstatePost.user', 'user')
      .skip((page - 1) * 10)
      .take(10);
    if (postQuery.postWhere) {
      postQuery.postWhere.forEach((item: string) => {
        query = query.andWhere(`RealEstatePost.${item}`);
      });
    }
    if (postQuery.userWhere) {
      postQuery.userWhere.forEach((item: string) => {
        const userWhere = `"user".${item}`;
        query = query.andWhere(userWhere);
      });
    }

    query = query.setParameters({ current_user_id: user_id });

    var { search } = postQuery;
    if (search) {
      search = search.replace(/ /g, ' | ');
      query = query.andWhere(`"RealEstatePost".document @@ to_tsquery('simple', unaccent('${search}'))`);
      query = query.orderBy(`ts_rank(document, to_tsquery('simple', unaccent('${search}')))`, 'DESC');
    }
    query = query.orderBy(postQuery.order);

    const getSql = query.getSql();
    console.log(getSql);
    const posts = await query.getMany();
    return posts;
  }

  async getPostsByProject(project_id: any) {
    return project_id;
  }

  async getPostsByType(type_id: any) {
    return type_id;
  }

  async checkPostExist(id: string) {
    const post = await this.postRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .setParameters({
        current_user_id: null,
      })
      .getOne();
    // .andWhere('expiry_date >= :expiry_date', { expiry_date: new Date() })
    // .andWhere('is_active = :is_active', { is_active: true })

    return post;
  }

  /**
   * Toggles the favorite status of a post for a given user.
   * @param user_id - The ID of the user.
   * @param post_id - The ID of the post.
   * @returns A boolean indicating whether the post is now favorited or not.
   */
  async toggleFavorite(user_id: string, post_id: string): Promise<boolean> {
    const favoritePost = await this.postFavoriteRepository.findOne({
      where: {
        user_id,
        real_estate_posts_id: post_id,
      },
    });
    if (favoritePost) {
      await this.postFavoriteRepository.delete({
        user_id,
        real_estate_posts_id: post_id,
      });
      return false;
    } else {
      await this.postFavoriteRepository.insert({
        user_id,
        real_estate_posts_id: post_id,
      });
      return true;
    }
  }

  // Mark read post
  async markReadPost(user_id: string, post_id: string) {
    await this.postViewRepository
      .insert({
        user_id,
        real_estate_posts_id: post_id,
        view_date: new Date(),
      })
      .catch((err) => {
        // If the post is already marked as read, do nothing
        if (err.code === '23505') {
          return;
        }
        throw err;
      });
  }
}

export default new PostServices();
