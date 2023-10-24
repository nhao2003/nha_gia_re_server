import { Request, Response } from 'express';
import AdminService from '../services/admin.services';
import { Brackets, JsonContains, MoreThanOrEqual, ObjectLiteral } from 'typeorm';
import { Equal, Not, In, MoreThan, LessThan, LessThanOrEqual } from 'typeorm';
import * as ok from 'typeorm';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { AppError } from '~/models/Error';
type WhereType = {
  where: Brackets | string | ObjectLiteral | ObjectLiteral[];
  parameters?: any;
};

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
  private static buildQuery = (req: Request) => {
    const {
      page,
      type_id,
      status,
      posted_date,
      expiry_date,
      price,
      desposit,
      is_lease,
      priority_level,
      project_id,
      is_pro_seller,
      sort_fields,
      sort_orders,
      province_code,
      district_code,
      ward_code,
    } = req.query;
    const pageParam = Number(page) || 1; // Trang hiện tại

    let where: any = {};

    if (type_id) {
      where.type_id = this.getOperatorValue(type_id as string);
    }

    if (status) {
      where.status = this.getOperatorValue(status as string);
    }

    if (posted_date) {
      where.posted_date = this.getOperatorValue(posted_date as string);
    }

    if (expiry_date) {
      where.expiry_date = this.getOperatorValue(expiry_date as string);
    }

    if (price) {
      where.price = this.getOperatorValue(price as string);
    }

    if (desposit) {
      where.desposit = this.getOperatorValue(desposit as string);
    }

    if (is_lease) {
      where.is_lease = this.getOperatorValue(is_lease as string);
    }

    if (priority_level) {
      where.is_priority = this.getOperatorValue(priority_level as string);
    }

    if (project_id) {
      // where.project_id = this.getOperatorValue(project_id as string);
    }

    if (is_pro_seller) {
      where.is_pro_seller = this.getOperatorValue(is_pro_seller as string);
    }

    const address: {
      [key: string]: Number;
    } = {};
    if (province_code) {
      address.province_code = Number(province_code);
    }
    if (district_code) {
      address.district_code = Number(district_code);
    }
    if (ward_code) {
      address.ward_code = Number(ward_code);
    }
    where.address = JsonContains(address);

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
      where,
      order,
    };
  };

  private static jsonBuildObject = (column: string, query: any, table?: string): string[] => {
    let where: string[] = [];
  
    const map: {
      [key: string]: string;
    } = {};
    const keys: string[] = Object.keys(query).filter((key) => key.startsWith(column));
  
    keys.forEach((key) => {
      map[key.split('.')[1]] = key;
    });
  
    // Each key, value in address object, build query string
    Object.keys(map).forEach((key) => {
      where.push(
        `${table ? table + '.' : ''}${column} ->> '${key}' ${this.getOperatorValueString(
          query[map[key]] as string,
        )}`,
      );
    });
  
    return where;
  };
  

  private static buildQuery2 = (req: Request) => {
    const {
      page,
      type_id,
      status,
      posted_date,
      expiry_date,
      price,
      desposit,
      is_lease,
      priority_level,
      project_id,
      is_pro_seller,
      sort_fields,
      sort_orders,
      province_code,
      district_code,
      ward_code,
    } = req.query;
    const pageParam = Number(page) || 1; // Trang hiện tại

    let where: string[] = [];

    if (type_id) {
      where.push(`type_id ${this.getOperatorValueString(type_id as string, 'text')}`);
    }

    if (status) {
      where.push(`status ${this.getOperatorValueString(status as string)}`);
    }

    if (posted_date) {
      where.push(`posted_date ${this.getOperatorValueString(posted_date as string)}`);
    }

    if (expiry_date) {
      where.push(`expiry_date ${this.getOperatorValueString(expiry_date as string)}`);
    }

    if (price) {
      where.push(`price ${this.getOperatorValueString(price as string)}`);
    }

    if (desposit) {
      where.push(`desposit ${this.getOperatorValueString(desposit as string)}`);
    }

    if (is_lease) {
      where.push(`is_lease ${this.getOperatorValueString(is_lease as string)}`);
    }

    if (priority_level) {
      where.push(`is_priority ${this.getOperatorValueString(priority_level as string)}`);
    }

    if (project_id) {
      // where.project_id = this.getOperatorValue(project_id as string);
    }

    if (is_pro_seller) {
      where.push(`is_pro_seller ${this.getOperatorValueString(is_pro_seller as string)}`);
    }
    where.push(...this.jsonBuildObject('address', req.query));
    where.push(...this.jsonBuildObject('features', req.query));

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
      where,
      order,
    };
  };
  static readonly getPosts = wrapRequestHandler(async (req: Request, res: Response) => {
    const { pageParam, where, order } = this.buildQuery2(req);
    const posts = await AdminService.getPostApproval(pageParam, where, order);
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
