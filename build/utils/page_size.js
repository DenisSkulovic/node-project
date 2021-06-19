"use strict";
var sizes = {
    small: process.env.MAX_QUERY_SIZE_SMALL,
    medium: process.env.MAX_QUERY_SIZE_MEDIUM,
    large: process.env.MAX_QUERY_SIZE_LARGE,
    huge: process.env.MAX_QUERY_SIZE_HUMONGOUS,
};
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
function handlePageSize(per_page, size) {
    return per_page > sizes[size] ? sizes[size] : per_page;
}
//
//
//
//
// ###################################################################################
module.exports = handlePageSize;
