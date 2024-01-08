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
import ServerCodes from '~/constants/server_codes';
import { NotificationService } from './nofitication.service';
@Service()
class PostServices {
  postRepository: Repository<RealEstatePost>;
  postFavoriteRepository: Repository<UserPostFavorite>;
  postViewRepository: Repository<UserPostView>;
  subscriptionRepository: Repository<Subscription>;
  membershipPackageServices: MembershipPackageServices;
  projectServices: ProjectServices;
  notificationServices: NotificationService;
  constructor(dataSource: DataSource, notificationServices: NotificationService) {
    this.postRepository = dataSource.getRepository(RealEstatePost);
    this.postFavoriteRepository = dataSource.getRepository(UserPostFavorite);
    this.postViewRepository = dataSource.getRepository(UserPostView);
    this.subscriptionRepository = dataSource.getRepository(Subscription);
    this.membershipPackageServices = new MembershipPackageServices(dataSource);
    this.projectServices = new ProjectServices(dataSource);
    this.notificationServices = notificationServices;
  }
  async createPost(user_id: string, data: Record<string, any>) {
    const subscriptionPackage = await this.membershipPackageServices.getCurrentUserSubscriptionPackage(user_id);
    const countPostInMonth = await this.countPostInMonth(user_id);
    const limitPostInMonth = subscriptionPackage ? subscriptionPackage.membership_package.monthly_post_limit : 3;
    if (countPostInMonth >= limitPostInMonth) {
      // throw new AppError(`You have exceeded the number of posts in the month (${limitPostInMonth} posts).`, 400);
      throw AppError.badRequest(
        ServerCodes.PostCode.ExceededNumberOfPostsInMonth,
        `You have exceeded the number of posts in the month (${limitPostInMonth} posts).`,
      );
    }
    let display_priority_point = 0;
    let post_approval_priority_point = 0;
    if (subscriptionPackage) {
      display_priority_point += subscriptionPackage.membership_package.display_priority_point;
      post_approval_priority_point += subscriptionPackage.membership_package.post_approval_priority_point;
      display_priority_point += subscriptionPackage.user.is_identity_verified ? 1 : 0;
    }
    data = {
      user_id,
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

  async checkLimitPostInMonth(user_id: string): Promise<{
    isExceeded: boolean;
    limit_post_in_month: number;
    count_post_in_month: number;
  }> {
    const subscriptionPackage = await this.membershipPackageServices.getCurrentUserSubscriptionPackage(user_id);
    const countPostInMonth = await this.countPostInMonth(user_id);
    const limitPostInMonth = subscriptionPackage ? subscriptionPackage.membership_package.monthly_post_limit : 3;
    return {
      isExceeded: countPostInMonth >= limitPostInMonth,
      limit_post_in_month: limitPostInMonth,
      count_post_in_month: countPostInMonth,
    };
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
    let { page } = postQuery;
    let skip = undefined;
    let take = undefined;
    if (page !== 'all') {
      page = isNaN(Number(page)) ? 1 : Number(page);
      skip = (page - 1) * AppConfig.ResultPerPage;
      take = AppConfig.ResultPerPage;
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

    let { search } = postQuery;
    if (search) {
      search = search.replace(/ /g, ' | ');
      query = query.andWhere(`"RealEstatePost".document @@ to_tsquery('simple', unaccent('${search}'))`);
      query = query.orderBy(`ts_rank(document, to_tsquery('simple', unaccent('${search}')))`, 'DESC');
    }
    query = query.orderBy(postQuery.order);

    const total = query.getCount();
    const data = query.skip(skip).take(take).getMany();
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

  // Thống kê số lượng bài theo loại bất động sản theo tháng trong năm
  async countPostByTypeInMonthOfYear() {
    const result = await this.postRepository
      .createQueryBuilder()
      .select('EXTRACT(MONTH FROM posted_date)', 'month')
      .addSelect('EXTRACT(YEAR FROM posted_date)', 'year')
      .addSelect('type_id')
      .addSelect('COUNT(*)', 'total_posts_by_type')
      .addSelect('is_lease')
      .where('EXTRACT(YEAR FROM posted_date) = 2023')
      .groupBy('EXTRACT(MONTH FROM posted_date), EXTRACT(YEAR FROM posted_date), type_id, is_lease')
      .orderBy('EXTRACT(YEAR FROM posted_date), EXTRACT(MONTH FROM posted_date), type_id, is_lease')
      .getRawMany();
    return result;
  }

  async countPostByStatus() {
    const result = await this.postRepository
      .createQueryBuilder()
      .select('status')
      .addSelect('COUNT(*)', 'total_posts_by_status')
      .groupBy('status')
      .orderBy('status')
      .getRawMany();
    return result;
  }

  async getTop10UsersHaveMostPosts() {
    const query = this.postRepository
      .createQueryBuilder('real_estate_post')
      .select('user.id', 'user_id')
      .addSelect('user.first_name', 'first_name')
      .addSelect('user.last_name', 'last_name')
      .addSelect('COUNT(real_estate_post.id)', 'post_count')
      .leftJoin('real_estate_post.user', 'user')
      .groupBy('user.id')
      .addGroupBy('user.first_name')
      .addGroupBy('user.last_name')
      .orderBy('post_count', 'DESC')
      .limit(10);
    const result = await query.getRawMany();

    return result;
  }

  async getFavoritePostsByUserId(
    user_id: string,
    page: number = 1,
  ): Promise<{
    data: RealEstatePost[];
    numberOfPages: number;
  }> {
    {
      // SELECT * FROM real_estate_posts
      // JOIN user_post_favorites ON
      // user_post_favorites.real_estate_posts_id = real_estate_posts.id
      // AND user_post_favorites.user_id = '1a9a5785-721a-4bb5-beb7-9d752e2070d4'
      const query = this.postRepository
        .createQueryBuilder('real_estate_posts')
        .leftJoinAndSelect('real_estate_posts.user_post_favorites', 'user_post_favorites')
        .leftJoinAndSelect('real_estate_posts.user', 'user')
        .where('user_post_favorites.user_id = :user_id', { user_id })
        .andWhere('real_estate_posts.is_active = :is_active', { is_active: true })
        .andWhere('real_estate_posts.expiry_date >= :expiry_date', { expiry_date: new Date() })
        .setParameters({ current_user_id: user_id });

      // const result = await query.getMany();
      const count = query.getCount();
      console.log(user_id);
      const result = query
        .skip((page - 1) * AppConfig.ResultPerPage)
        .take(AppConfig.ResultPerPage)
        .getMany();
      const data = await Promise.all([count, result]);
      return {
        numberOfPages: Math.ceil(data[0] / 10),
        data: data[1],
      };
    }
  }
}
export default PostServices;
