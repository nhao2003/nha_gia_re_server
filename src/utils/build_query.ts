import { BaseQuery } from '~/models/PostQuery';
import { AppError } from '../models/Error';

const getOperatorValueString = (operatorAndValue: Record<string, any>): string => {
  const operatorMapping: { [key: string]: string } = {
    eq: '=',
    neq: '<>',
    in: 'IN',
    notin: 'NOT IN',
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
    btw: 'BETWEEN',
    nbtw: 'NOT BETWEEN',
    like: 'LIKE',
    nlike: 'NOT LIKE',
    ilike: 'ILIKE',
    nilike: 'NOT ILIKE',
    similar: 'SIMILAR TO',
    nsimilar: 'NOT SIMILAR TO',
    regex: '~',
    nregex: '!~',
    iregex: '~*',
    niregex: '!~*',
  };
  const operator = Object.keys(operatorAndValue)[0];
  // const value = operatorAndValue[operator];
  // decodeURIComponent operatorAndValue[operator]
  const value = operatorAndValue[operator]
    .replace(/%20/g, ' ')
    .replace(/%2C/g, ',')
    .replace(/%27/g, "'")
    .replace(/%22/g, '"')
    .replace(/%3E/g, '>')
    .replace(/%3C/g, '<')
    .replace(/%3D/g, '=')
    .replace(/%3B/g, ';')
    .replace(/%2F/g, '/');
  if (operatorMapping[operator]) {
    let query = operatorMapping[operator];

    if (
      [
        'eq',
        'neq',
        'like',
        'nlike',
        'ilike',
        'nilike',
        'similar',
        'nsimilar',
        'regex',
        'nregex',
        'iregex',
        'niregex',
      ].includes(operator)
    ) {
      query += ` ${value}`;
    } else if (['in', 'notin'].includes(operator)) {
      query += ` (${value})`;
    } else if (['btw', 'nbtw'].includes(operator)) {
      const from = value.split(',')[0];
      const to = value.split(',')[1];
      query += ` ${from} AND ${to}`;
    } else {
      query += ` ${value}`;
    }

    return query;
  }
  throw new AppError('Invalid operator', 400);
};

const buildQuery = (query: Record<string, any>): string[] => {
  const where: string[] = [];
  Object.keys(query).forEach((key) => {
    const value = getOperatorValueString(query[key]);
    if (key.includes('->>')) {
      const column = key.split('->>')[0];
      const field = key.split('->>')[1];
      where.push(`${column} ->> '${field}' ${value}`);
      return;
    } else {
      where.push(`${key} ${value}`);
    }
  });
  return where;
};

const buildOrder = (
  orders: string,
  table: string | null = null,
):
  | {
      sort: string;
      order?: 'ASC' | 'DESC';
    }
  | {} => {
  if (!orders) {
    return {};
  }

  const res: any = {};
  const fields = orders.toString().split(',');

  fields.forEach((field: string) => {
    const order = field.charAt(0) === '-' ? 'desc' : 'asc';
    const typeormSortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    //Remove - or + from field name
    field = field.replace(/[-+]/g, '');
    res[`${table ? table + '.' : ''}${field}`] = typeormSortOrder;
  });
  return res;
};

function buildBaseQuery(query: Record<string, any>): BaseQuery {
  let { page, orders } = query;
  if (!page) {
    page = 1;
  }
  const handleQuery = {
    ...query,
  };
  delete handleQuery.page;
  delete handleQuery.orders;
  const wheres = buildQuery(handleQuery);
  const buildOrders = buildOrder(orders);
  return { page, wheres, orders: buildOrders };
}

export { buildQuery, getOperatorValueString, buildOrder, buildBaseQuery };
