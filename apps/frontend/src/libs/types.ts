export type IPaginationMeta = {
  limit: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type IPagination<T> = {
  items: T[];
  meta: IPaginationMeta;
};

export interface QueryParams {
  query?: string;
  page?: number;
  limit?: number;
}
