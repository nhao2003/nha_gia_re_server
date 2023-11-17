import Blog from '~/domain/databases/entity/Blog';
import CommonServices from './common.services';
import { DataSource, Repository } from 'typeorm';
import { UserBlogFavorite } from '~/domain/databases/entity/UserBlogFavorite';
import { Service } from 'typedi';

@Service()
class BlogService extends CommonServices {
  constructor(dataSource: DataSource) {
    super(Blog, dataSource);
  }

  async getAllWithFavoriteByQuery(query: any, current_user_id: string | null) {
    let { page, wheres, orders } = query;
    page = Number(page) || 1;
    const skip = (page - 1) * 10;
    const take = 10;
    let devQuery = (this.repository as Repository<Blog>).createQueryBuilder();
    if (wheres) {
      wheres.forEach((where: string) => {
        devQuery = devQuery.andWhere(where);
      });
    }
    if (orders) {
      devQuery = devQuery.orderBy(orders);
    }
    devQuery = devQuery.setParameters({ current_user_id });
    const getCount = devQuery.getCount();
    const getMany = devQuery.skip(skip).take(take).getMany();
    const res = await Promise.all([getMany, getCount]);
    return {
      num_of_pages: Math.ceil(res[1] / 10),
      data: res[0],
    };
  }
}

export default BlogService;
