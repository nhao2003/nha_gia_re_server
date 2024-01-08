export type PostQuery = {
  page: number | string | null;
  postWhere: string[];
  order: any;
  userWhere: string[];
  search?: string | null;
};

export type BaseQuery = {
  search?: string | null;
  page: number | string | null;
  wheres: string[];
  orders: any;
};