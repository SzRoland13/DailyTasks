export type PaginationRequest = {
  page: number;
  size: number;
};

export type PaginationResponse<T> = {
  data: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};
