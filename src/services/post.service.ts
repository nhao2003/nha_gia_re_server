import { DataSource, MoreThanOrEqual, Repository } from 'typeorm';
import { PostStatus } from '~/constants/enum';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import UserPostFavorite from '~/domain/databases/entity/UserPostFavorite';
import UserPostView from '~/domain/databases/entity/UserPostView';
import { PostQuery } from '~/models/PostQuery';
import { buildOrder, buildQuery } from '~/utils/build_query';
import { parseTimeToMilliseconds } from '~/utils/time';
import ProjectServices from './project.service';
import Subscription from '~/domain/databases/entity/Subscription ';
import { AppError } from '~/models/Error';
import MembershipPackageServices from './membership_package.service';
import { Service } from 'typedi';
import AppConfig from '~/constants/configs';
@Service()
class PostServices {
  postRepository: Repository<RealEstatePost>;
  postFavoriteRepository: Repository<UserPostFavorite>;
  postViewRepository: Repository<UserPostView>;
  subscriptionRepository: Repository<Subscription>;
  membershipPackageServices: MembershipPackageServices
  projectServices: ProjectServices;
  constructor(dataSource: DataSource ) {
    this.postRepository = dataSource.getRepository(RealEstatePost);
    this.postFavoriteRepository = dataSource.getRepository(UserPostFavorite);
    this.postViewRepository = dataSource.getRepository(UserPostView);
    this.subscriptionRepository = dataSource.getRepository(Subscription);
    this.membershipPackageServices = new MembershipPackageServices(dataSource);
    this.projectServices = new ProjectServices(dataSource);
  }
  async createPost(data: Record<string, any>) {
    const subscriptionPackage = await this.membershipPackageServices.getCurrentUserSubscriptionPackage(data.user_id);
    const countPostInMonth = await this.countPostInMonth(data.user_id);
    const limitPostInMonth = subscriptionPackage ? subscriptionPackage.membership_package.monthly_post_limit : 3;
    if (countPostInMonth >= limitPostInMonth) {
      throw new AppError(`You have exceeded the number of posts in the month (${limitPostInMonth} posts).`, 400);
    }
    var display_priority_point = 0;
    var post_approval_priority_point = 0;
    if (subscriptionPackage) {
      display_priority_point += subscriptionPackage.membership_package.display_priority_point;
      post_approval_priority_point += subscriptionPackage.membership_package.post_approval_priority_point;
      display_priority_point += subscriptionPackage.user.is_identity_verified ? 1 : 0;
    }
    data = {
      ...data,
      status: PostStatus.pending,
      //expiry_date 14 days from now
      expiry_date: new Date(Date.now() + parseTimeToMilliseconds('14d')),
      is_priority: false,
      display_priority_point,
      post_approval_priority_point,
    };
    const project = data.project;
    if (project) {
      data.project_id = await this.projectServices.getOrCreateUnverifiedProject(project.id, project.project_name);
    }
    delete data.project;
    await this.postRepository.insert(data);
    return data;
  }

  async getPostById(id: any): Promise<RealEstatePost | null> {
    const post = await this.postRepository
      .createQueryBuilder()
      .where('id = :id', { id })
      .andWhere('is_active = :is_active', { is_active: true })
      .setParameters({ current_user_id: null })
      .getOne();
    return post;
  }
  async updatePost(id: string, data: any): Promise<any> {
    data = {
      ...data,
    };
    const project = data.project;
    if (project) {
      data.project_id = await this.projectServices.getOrCreateUnverifiedProject(project.id, project.project_name);
      await this.projectServices.deleteUnverifiedProject(project.id);
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
    const pageParam = page === 'all' ? page : isNaN(Number(page)) ? 1 : Number(page);
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

  async getPostsByQuery(
    postQuery: PostQuery,
    user_id: string | null = null,
  ): Promise<{ data: RealEstatePost[]; numberOfPages: number }> {
    let { page, postWhere, order } = postQuery;
    let skip = undefined;
    let take = undefined;
    if (page !== 'all') {
      page = isNaN(Number(page)) ? 1 : Number(page);
      skip = (page - 1) * AppConfig.RESULT_PER_PAGE;
      take = AppConfig.RESULT_PER_PAGE;
    }
    let query = this.postRepository.createQueryBuilder().leftJoinAndSelect('RealEstatePost.user', 'user');

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

    const total = query.getCount();
    const data = query
      .skip(skip)
      .take(take)
      .getMany();
    const result = await Promise.all([total, data]);
    return {
      numberOfPages: Math.ceil(result[0] / 10),
      data: result[1],
    };
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

  // Đếm tổng số bài đăng của user trong 1 tháng
  async countPostInMonth(user_id: string) {
    const count = await this.postRepository
      .createQueryBuilder()
      .where('user_id = :user_id', { user_id })
      .andWhere({
        is_active: true,
      })
      .andWhere('EXTRACT(MONTH FROM posted_date) = EXTRACT(MONTH FROM CURRENT_TIMESTAMP)')
      .andWhere('EXTRACT(YEAR FROM posted_date) = EXTRACT(YEAR FROM CURRENT_TIMESTAMP)')
      .getCount();
    return count;
  }
}

export default PostServices;
