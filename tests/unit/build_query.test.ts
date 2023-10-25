import { buildOrder, getOperatorValueString } from '../../src/utils/build_query';

describe('getOperatorValueString', () => {
  it('should return "=" when given "eq:value"', () => {
    expect(getOperatorValueString('eq:value')).toBe("= 'value'");
  });

  it('should return "<>" when given "neq:value"', () => {
    expect(getOperatorValueString('neq:value')).toBe("<> 'value'");
  });

  it('should return "IN (value)" when given "in:value"', () => {
    expect(getOperatorValueString('in:value')).toBe('IN (value)');
  });

  it('should return "NOT IN (value)" when given "notin:value"', () => {
    expect(getOperatorValueString('notin:value')).toBe('NOT IN (value)');
  });

  it('should return ">" when given "gt:value"', () => {
    expect(getOperatorValueString('gt:value')).toBe("> value");
  });

  it('should return ">=" when given "gte:value"', () => {
    expect(getOperatorValueString('gte:value')).toBe(">= value");
  });

  it('should return "<" when given "lt:value"', () => {
    expect(getOperatorValueString('lt:value')).toBe("< value");
  });

  it('should return "<=" when given "lte:value"', () => {
    expect(getOperatorValueString('lte:value')).toBe("<= value");
  });

  it('should return "BETWEEN from AND to" when given "btw:from,to"', () => {
    expect(getOperatorValueString('btw:1,10')).toBe('BETWEEN 1 AND 10');
  });

  it('should return "NOT BETWEEN from AND to" when given "nbtw:from,to"', () => {
    expect(getOperatorValueString('nbtw:1,10')).toBe('NOT BETWEEN 1 AND 10');
  });

  it('should return "LIKE \'value\'" when given "like:value"', () => {
    expect(getOperatorValueString('like:value')).toBe("LIKE 'value'");
  });

  it('should return "NOT LIKE \'value\'" when given "nlike:value"', () => {
    expect(getOperatorValueString('nlike:value')).toBe("NOT LIKE 'value'");
  });

  it('should return "ILIKE \'value\'" when given "ilike:value"', () => {
    expect(getOperatorValueString('ilike:value')).toBe("ILIKE 'value'");
  });

  it('should return "NOT ILIKE \'value\'" when given "nilike:value"', () => {
    expect(getOperatorValueString('nilike:value')).toBe("NOT ILIKE 'value'");
  });

  it('should return "SIMILAR TO \'value\'" when given "similar:value"', () => {
    expect(getOperatorValueString('similar:value')).toBe("SIMILAR TO 'value'");
  });

  it('should return "NOT SIMILAR TO \'value\'" when given "nsimilar:value"', () => {
    expect(getOperatorValueString('nsimilar:value')).toBe("NOT SIMILAR TO 'value'");
  });

  it('should return "~ \'value\'" when given "regex:value"', () => {
    expect(getOperatorValueString('regex:value')).toBe("~ 'value'");
  });

  it('should return "!~ \'value\'" when given "nregex:value"', () => {
    expect(getOperatorValueString('nregex:value')).toBe("!~ 'value'");
  });

  it('should return "~* \'value\'" when given "iregex:value"', () => {
    expect(getOperatorValueString('iregex:value')).toBe("~* 'value'");
  });

  it('should return "!~* \'value\'" when given "niregex:value"', () => {
    expect(getOperatorValueString('niregex:value')).toBe("!~* 'value'");
  });

  it('should throw an error when given an invalid operator', () => {
    expect(() => getOperatorValueString('invalid:value')).toThrow('Invalid operator');
  });

  it('should append "::cast" when given a cast parameter', () => {
    expect(getOperatorValueString('eq:value', 'integer')).toBe("= 'value'::integer");
  });
});
describe('buildOrder', () => {
  it('should return an empty object when given empty fields', () => {
    expect(buildOrder('', null, null)).toEqual({});
  });

  it('should return an object with one field when given one field', () => {
    expect(buildOrder('id', null, 'users')).toEqual({ 'users.id': 'ASC' });
  });

  it('should return an object with multiple fields when given multiple fields', () => {
    expect(buildOrder('id,name,age', 'asc,desc,asc', 'users')).toEqual({
      'users.id': 'ASC',
      'users.name': 'DESC',
      'users.age': 'ASC',
    });
  });

  it('should default to ascending order when no order is specified', () => {
    expect(buildOrder('id,name,age', null, 'users')).toEqual({
      'users.id': 'ASC',
      'users.name': 'ASC',
      'users.age': 'ASC',
    });
  });
});