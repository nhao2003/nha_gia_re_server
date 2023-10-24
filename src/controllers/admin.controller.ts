import { Request, Response } from 'express';
import AdminService from '../services/admin.services';
import { Brackets, JsonContains, MoreThanOrEqual, ObjectLiteral } from 'typeorm';
import { Equal, Not, In, MoreThan, LessThan, LessThanOrEqual } from 'typeorm';
import * as ok from 'typeorm';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { AppError } from '~/models/Error';

class AdminController {
  private static getOperatorValue = (originalValue: string) => {
    const operator = originalValue.toString().split(':')[0];
    const value = originalValue.toString().split(':')[1];
    if (operator === 'eq') {
      return Equal(value);
    }
    if (operator === 'neq') {
      return Not(value);
    }
    if (operator === 'in') {
      return In(value.toString().split(','));
    }
    if (operator === 'notin') {
      return Not(In(value.toString().split(',')));
    }
    if (operator === 'gt') {
      return MoreThan(value);
    }
    if (operator === 'gte') {
      return MoreThanOrEqual(value);
    }
    if (operator === 'lt') {
      return LessThan(value);
    }
    if (operator === 'lte') {
      return LessThanOrEqual(value);
    }
    return null;
  };

  // private static getOperatorValueString = (originalValue: string, cast?: string) => {
  //   const operator = originalValue.toString().split(':')[0];
  //   const value = originalValue.toString().split(':')[1];
  //   let query = '';
  //   if (operator === 'eq') {
  //     query = `= ${value}`;
  //     if (cast) {
  //       query = `= ${value}::${cast}`;
  //     }
  //   }
  //   if (operator === 'neq') {
  //     query = `<> ${value}`;
  //     if (cast) {
  //       query = `<> ${value}::${cast}`;
  //     }
  //   }
  //   if (operator === 'in') {
  //     query = `IN (${value})`;
  //     if (cast) {
  //       query = `IN (${value}::${cast})`;
  //     }
  //   }
  //   if (operator === 'notin') {
  //     query = `NOT IN (${value})`;
  //     if (cast) {
  //       query = `NOT IN (${value}::${cast})`;
  //     }
  //   }
  //   if (operator === 'gt') {
  //     query = `> ${value}`;
  //     if (cast) {
  //       query = `> ${value}::${cast}`;
  //     }
  //   }
  //   if (operator === 'gte') {
  //     query = `>= ${value}`;
  //     if (cast) {
  //       query = `>= ${value}::${cast}`;
  //     }
  //   }
  //   if (operator === 'lt') {
  //     query = `< ${value}`;
  //     if (cast) {
  //       query = `< ${value}::${cast}`;
  //     }
  //   }
  //   if (operator === 'lte') {
  //     query = `<= ${value}`;
  //     if (cast) {
  //       query = `<= ${value}::${cast}`;
  //     }
  //   }
  //   // between
  //   if (operator === 'btw') {
  //     const from = value.toString().split(',')[0];
  //     const to = value.toString().split(',')[1];
  //     if (cast) {
  //       query = `BETWEEN ${from}::${cast} AND ${to}::${cast}`;
  //     } else {
  //       query = `BETWEEN ${from} AND ${to}`;
  //     }
  //   }
  //   // not between
  //   if (operator === 'nbtw') {
  //     const from = value.toString().split(',')[0];
  //     const to = value.toString().split(',')[1];
  //     if (cast) {
  //       query = `NOT BETWEEN ${from}::${cast} AND ${to}::${cast}`;
  //     } else {
  //       query = `NOT BETWEEN ${from} AND ${to}`;
  //     }
  //   }

  //   if (operator === 'like') {
  //     query = `LIKE ${value}`;
  //   }
  //   if (operator === 'nlike') {
  //     query = `NOT LIKE ${value}`;
  //   }
  //   if (operator === 'ilike') {
  //     query = `ILIKE ${value}`;
  //   }
  //   if (operator === 'nilike') {
  //     query = `NOT ILIKE ${value}`;
  //   }
  //   if (operator === 'similar') {
  //     query = `SIMILAR TO ${value}`;
  //   }
  //   if (operator === 'nsimilar') {
  //     query = `NOT SIMILAR TO ${value}`;
  //   }
  //   if (operator === 'regex') {
  //     query = `~ ${value}`;
  //   }
  //   if (operator === 'nregex') {
  //     query = `!~ ${value}`;
  //   }
  //   if (operator === 'iregex') {
  //     query = `~* ${value}`;
  //   }
  //   if (operator === 'niregex') {
  //     query = `!~* ${value}`;
  //   }

  //   if (query) {
  //     return query;
  //   }
  //   throw new AppError('Invalid operator', 400);
  // };
  private static getOperatorValueString = (originalValue: string, cast?: string) => {
    const operator = originalValue.toString().split(':')[0];
    const value = originalValue.toString().split(':')[1];
    let query = '';
    if (operator === 'eq') {
      query = `= '${value}'`;
      if (cast) {
        query = `= '${value}'::${cast}`;
      }
    }
    if (operator === 'neq') {
      query = `<> ${value}`;
      if (cast) {
        query = `<> '${value}'::${cast}`;
      }
    }
    if (operator === 'in') {
      query = `IN (${value})`;
      if (cast) {
        query = `IN (${value}::${cast})`;
      }
    }
    if (operator === 'notin') {
      query = `NOT IN (${value})`;
      if (cast) {
        query = `NOT IN (${value}::${cast})`;
      }
    }
    if (operator === 'gt') {
      query = `> '${value}'`;
      if (cast) {
        query = `> '${value}'::${cast}`;
      }
    }
    if (operator === 'gte') {
      query = `>= '${value}'`;
      if (cast) {
        query = `>= '${value}'::${cast}`;
      }
    }
    if (operator === 'lt') {
      query = `< ${value}`;
      if (cast) {
        query = `< '${value}'::${cast}`;
      }
    }
    if (operator === 'lte') {
      query = `<= '${value}'`;
      if (cast) {
        query = `<= '${value}'::${cast}`;
      }
    }
    //between
    if (operator === 'btw') {
      const from = value.toString().split(',')[0];
      const to = value.toString().split(',')[1];
      if (cast) {
        query = `BETWEEN ${from}::${cast} AND ${to}::${cast}`;
      } else {
        query = `BETWEEN ${from} AND ${to}`;
      }
    }
    //not between
    if (operator === 'nbtw') {
      const from = value.toString().split(',')[0];
      const to = value.toString().split(',')[1];
      if (cast) {
        query = `NOT BETWEEN ${from}::${cast} AND ${to}::${cast}`;
      } else {
        query = `NOT BETWEEN ${from} AND ${to}`;
      }
    }

    if (operator === 'like') {
      query = `LIKE '${value}'`;
    }
    if (operator === 'nlike') {
      query = `NOT LIKE '${value}'`;
    }
    if (operator === 'ilike') {
      query = `ILIKE '${value}'`;
    }
    if (operator === 'nilike') {
      query = `NOT ILIKE '${value}'`;
    }
    if (operator === 'similar') {
      query = `SIMILAR TO '${value}'`;
    }
    if (operator === 'nsimilar') {
      query = `NOT SIMILAR TO '${value}'`;
    }
    if (operator === 'regex') {
      query = `~ '${value}'`;
    }
    if (operator === 'nregex') {
      query = `!~ '${value}'`;
    }
    if (operator === 'iregex') {
      query = `~* '${value}'`;
    }
    if (operator === 'niregex') {
      query = `!~* '${value}'`;
    }

    if (query) {
      return query;
    }
    throw new AppError('Invalid operator', 400);
  };

  private static jsonBuildObject = (column: string, query: any, table?: string): string[] => {
    let where: string[] = [];

    const map: {
      [key: string]: string;
    } = {};
    const keys: string[] = Object.keys(query).filter((key) => key.startsWith(column));

    keys.forEach((key) => {
      map[key.split('.')[1]] = query[key];
    });

    // Each key, value in address object, build query string
    Object.keys(map).forEach((key) => {
      where.push(
        `${table ? table + '.' : ''}${column} ->> '${key}' ${this.getOperatorValueString(map[key] as string)}`,
      );
    });

    return where;
  };

  private static buildPostQuery = (query: any): string[] => {
    const where: string[] = [];

    //Get all keys start with post
    const keys: string[] = Object.keys(query).filter((key) => key.startsWith('post.'));

    const map: {
      [key: string]: string;
    } = {};

    keys.forEach((key) => {
      //Remove post. from key. Don't use split('.') because key may contain '.'
      map[key.replace('post.', '')] = query[key];
    });

    where.push(...this.jsonBuildObject('address', map));
    where.push(...this.jsonBuildObject('features', map));
    Object.keys(map).forEach((key) => {
      const condition = !(key.startsWith('address') || key.startsWith('features'));
      if (condition) where.push(`${key} ${this.getOperatorValueString(map[key]as string)}`);
    });

    return where;
  };

  private static buildUserQuery = (query: any): string[] => {
    const where: string[] = [];
    //Get all keys start with post
    const keys: string[] = Object.keys(query).filter((key) => key.startsWith('user.'));

    const map: {
      [key: string]: string;
    } = {};

    keys.forEach((key) => {
      //Remove post. from key. Don't use split('.') because key may contain '.'
      map[key.replace('user.', '')] = query[key];
    });

    where.push(...this.jsonBuildObject('address', map));
    Object.keys(map).forEach((key) => {
      const condition = !key.startsWith('address');
      if (condition) where.push(`${key} ${this.getOperatorValueString(map[key]as string)}`);
    });

    return where;
  };

  private static buildQuery2 = (req: Request) => {
    const {
      page,
      sort_fields,
      sort_orders,
    } = req.query;
    const pageParam = Number(page) || 1;
    const postWhere: string[] = this.buildPostQuery(req.query);
    const userWhere: string[] = this.buildUserQuery(req.query);

    const order: any = {};
    if (sort_fields && sort_orders) {
      const fields = sort_fields.toString().split(',');
      const orders = sort_orders.toString().split(',');
      fields.forEach((field: string, index: number) => {
        if (orders[index] === 'asc' || orders[index] === 'desc') {
          const typeormSortOrder = orders[index].toLowerCase() === 'asc' ? 'ASC' : 'DESC';
          order[`RealEstatePost.${field}`] = typeormSortOrder;
        }
      });
    }

    return {
      pageParam,
      postWhere,
      userWhere,
      order,
    };
  };
  static readonly getPosts = wrapRequestHandler(async (req: Request, res: Response) => {
    const { pageParam, postWhere, userWhere, order } = this.buildQuery2(req);
    const posts = await AdminService.getPostApproval(pageParam, postWhere, order, userWhere);
    return res.json(posts);
  });

  static readonly approvePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.approvePost(id);
    return res.json(result);
  };

  static readonly rejectPost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { reason } = req.body;
    const result = await AdminService.rejectPost(id, reason);
    return res.json(result);
  };

  static readonly deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.deletePost(id);
    return res.json(result);
  };
}

export default AdminController;
