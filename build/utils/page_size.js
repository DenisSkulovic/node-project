"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlePageSize = void 0;
var sizes = new Map([
    ["small", process.env["MAX_QUERY_SIZE_SMALL"]],
    ["medium", process.env["MAX_QUERY_SIZE_MEDIUM"]],
    ["large", process.env["MAX_QUERY_SIZE_LARGE"]],
    ["huge", process.env["MAX_QUERY_SIZE_HUMONGOUS"]],
]);
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
var handlePageSize = function (per_page, size) {
    return per_page > parseInt(sizes.get(size)) ? parseInt(sizes.get(size)) : per_page;
};
exports.handlePageSize = handlePageSize;
//
//
//
//
// ###################################################################################
