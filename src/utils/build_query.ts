import { AppError } from '../models/Error';

const getOperatorValueString = (originalValue: string, cast?: string) => {
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

  const operator = originalValue.split(':')[0];
  const value = originalValue.split(':')[1];

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
      query += ` '${value}'`;
    } else if (['in', 'notin'].includes(operator)) {
      query += ` (${value})`;
    } else if (['btw', 'nbtw'].includes(operator)) {
      const from = value.split(',')[0];
      const to = value.split(',')[1];
      query += ` ${from} AND ${to}`;
    } else {
      query += ` ${value}`;
    }

    if (cast) {
      query += `::${cast}`;
    }

    return query;
  }

  throw new AppError('Invalid operator', 400);
};

const jsonBuildQueries = (column: string, query: any, table?: string): string[] => {
  const where: string[] = [];
  const map: { [key: string]: string } = {};

  const keys: string[] = Object.keys(query).filter((key) => key.startsWith(column));

  keys.forEach((key) => {
    map[key.split('.')[1]] = query[key];
  });

  Object.keys(map).forEach((key) => {
    where.push(`${table ? table + '.' : ''}${column} ->> '${key}' ${getOperatorValueString(map[key] as string)}`);
  });

  return where;
};

const buildQuery = (query: any, jsons?: string[]): string[] => {
  const where: string[] = [];
  if (jsons) {
    jsons.forEach((json) => {
      where.push(...jsonBuildQueries(json, query));
    });
  }

  Object.keys(query).forEach((key) => {
    const condition = !jsons || !jsons.some((excludedKey) => key.startsWith(excludedKey));
    if (condition) {
      where.push(`${key} ${getOperatorValueString(query[key] as string)}`);
    }
  });

  return where;
};

const buildOrder = (
  sort_fields: string,
  sort_orders: string | null,
  table: string | null = null,
):
  | {
      sort: string;
      order?: 'ASC' | 'DESC';
    }
  | {} => {
  if (!sort_fields) {
    // Return empty object if sort_fields is not provided
    return {};
  }

  const res: any = {};
  const fields = sort_fields.toString().split(',');
  const orders = sort_orders?.toString().split(',') || [];

  fields.forEach((field: string, index: number) => {
    const order = orders[index] || 'asc';
    const typeormSortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    res[`${table ? table + '.' : ''}${field}`] = typeormSortOrder;
  });
  return res;
};

export { buildQuery, getOperatorValueString, buildOrder };
