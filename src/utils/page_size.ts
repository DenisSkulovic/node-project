
const sizes: Map<string, string> = new Map([
  ["small", process.env["MAX_QUERY_SIZE_SMALL"]!],
  ["medium", process.env["MAX_QUERY_SIZE_MEDIUM"]!],
  ["large", process.env["MAX_QUERY_SIZE_LARGE"]!],
  ["huge", process.env["MAX_QUERY_SIZE_HUMONGOUS"]!],
]
)

//
//
//
//
// ###################################################################################
/**
 * Get page size (LIMIT) for SQL query. Either returns the same number, or the maximum if it was exceeded.
 * @param {number} per_page
 * @param {string} size
 * @returns {number}
 */
export const handlePageSize = (per_page: number, size: string): number => {
  return per_page > parseInt(sizes.get(size)!) ? parseInt(sizes.get(size)!) : per_page;
}

//
//
//
//
// ###################################################################################
