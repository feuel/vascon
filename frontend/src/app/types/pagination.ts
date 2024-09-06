export interface PaginationInterface {
  total_record: number;
  total_pages: number;
  current_page: number;
  previous_page: number | null;
  next_page: number | null;
  per_page: number;
}
