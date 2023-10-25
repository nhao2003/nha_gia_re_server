"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildOrder = exports.getOperatorValueString = exports.buildQuery = void 0;
const Error_1 = require("../models/Error");
const getOperatorValueString = (originalValue, cast) => {
    const operatorMapping = {
        eq: '=',
        neq: '<>',
        in: 'IN',
        notin: 'NOT IN',
        gt: '>',
        gte: '>=',
        lt: '<',
        lte: '<=',
        btw: 'BETWEEN',
        nbtw: 'NOT BETWEEN',
        like: 'LIKE',
        nlike: 'NOT LIKE',
        ilike: 'ILIKE',
        nilike: 'NOT ILIKE',
        similar: 'SIMILAR TO',
        nsimilar: 'NOT SIMILAR TO',
        regex: '~',
        nregex: '!~',
        iregex: '~*',
        niregex: '!~*',
    };
    const operator = originalValue.split(':')[0];
    const value = originalValue.split(':')[1];
    if (operatorMapping[operator]) {
        let query = operatorMapping[operator];
        if ([
            'eq',
            'neq',
            'like',
            'nlike',
            'ilike',
            'nilike',
            'similar',
            'nsimilar',
            'regex',
            'nregex',
            'iregex',
            'niregex',
        ].includes(operator)) {
            query += ` '${value}'`;
        }
        else if (['in', 'notin'].includes(operator)) {
            query += ` (${value})`;
        }
        else if (['btw', 'nbtw'].includes(operator)) {
            const from = value.split(',')[0];
            const to = value.split(',')[1];
            query += ` ${from} AND ${to}`;
        }
        else {
            query += ` ${value}`;
        }
        if (cast) {
            query += `::${cast}`;
        }
        return query;
    }
    throw new Error_1.AppError('Invalid operator', 400);
};
exports.getOperatorValueString = getOperatorValueString;
const jsonBuildQueries = (column, query, table) => {
    const where = [];
    const map = {};
    const keys = Object.keys(query).filter((key) => key.startsWith(column));
    keys.forEach((key) => {
        map[key.split('.')[1]] = query[key];
    });
    Object.keys(map).forEach((key) => {
        where.push(`${table ? table + '.' : ''}${column} ->> '${key}' ${getOperatorValueString(map[key])}`);
    });
    return where;
};
const buildQuery = (query, jsons) => {
    const where = [];
    if (jsons) {
        jsons.forEach((json) => {
            where.push(...jsonBuildQueries(json, query));
        });
    }
    Object.keys(query).forEach((key) => {
        const condition = !jsons || !jsons.some((excludedKey) => key.startsWith(excludedKey));
        if (condition) {
            where.push(`${key} ${getOperatorValueString(query[key])}`);
        }
    });
    return where;
};
exports.buildQuery = buildQuery;
const buildOrder = (sort_fields, sort_orders, table = null) => {
    if (!sort_fields) {
        // Return empty object if sort_fields is not provided
        return {};
    }
    const res = {};
    const fields = sort_fields.toString().split(',');
    const orders = sort_orders?.toString().split(',') || [];
    fields.forEach((field, index) => {
        const order = orders[index] || 'asc';
        const typeormSortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
        res[`${table ? table + '.' : ''}${field}`] = typeormSortOrder;
    });
    return res;
};
exports.buildOrder = buildOrder;
