export function getPaginationData(
  currentPage: number,
  total: number,
  perPage: number
) {
  const totalPages = Math.ceil(total / perPage);
  const previousPage = currentPage - 1 < 1 ? null : currentPage - 1;
  const nextPage = currentPage + 1 > totalPages ? null : currentPage + 1;
  return {
    total_record: total,
    total_pages: totalPages,
    current_page: currentPage,
    previous_page: previousPage,
    next_page: nextPage,
    per_page: perPage,
  };
}
