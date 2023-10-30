export type PostQuery = {
  page: number;
  postWhere: string[];
  order: any;
  userWhere: string[];
  search?: string | null;
};

export type BaseQuery = {
  page: number;
  wheres: string[];
  orders: any;
};