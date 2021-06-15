const sizes = {
  small: process.env.MAX_QUERY_SIZE_SMALL,
  medium: process.env.MAX_QUERY_SIZE_MEDIUM,
  large: process.env.MAX_QUERY_SIZE_LARGE,
  huge: process.env.MAX_QUERY_SIZE_HUMONGOUS,
};

function handlePageSize(per_page, size) {
  return per_page > sizes[size] ? sizes[size] : per_page;
}

module.exports = handlePageSize;
