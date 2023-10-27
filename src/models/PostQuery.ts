export type PostQuery = {
  page: number;
  postWhere: string[];
  order: any;
  userWhere: string[];
};

export type BaseQuery = {
  page: number;
  wheres: string[];
  orders: any;
};