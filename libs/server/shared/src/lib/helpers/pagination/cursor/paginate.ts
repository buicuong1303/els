import { Logger } from '@nestjs/common';
import { CursorPageInfo } from './page-info';
import { PaginationArgs } from './pagination.args';
import { SelectQueryBuilder, MoreThan, LessThan, In } from 'typeorm';

export async function paginate<T>(
  query: SelectQueryBuilder<T>,
  paginationArgs: PaginationArgs | any,
  cursorColumn = 'index',
  defaultLimit = 25,
): Promise<any> {
  const logger = new Logger('Pagination');
  if (paginationArgs['ids'] && paginationArgs['ids'].length > 0) {
    const result = await query.andWhere({
      id: In(paginationArgs['ids'])
    }).getMany();

    return {
      nodes: result
    };
  }

  // pagination ordering
  query.orderBy({ [cursorColumn]: 'ASC' });
  const totalCountQuery = query.clone();

  // FORWARD pagination
  if (paginationArgs.first) {
    if (paginationArgs.after) {
      const offsetId = Number(
        Buffer.from(paginationArgs.after, 'base64').toString('ascii'),
      );
      logger.verbose(`Paginate AfterID: ${offsetId}`);
      query.where({ [cursorColumn]: MoreThan(offsetId) });
    }

    const limit = paginationArgs.first ?? defaultLimit;
    query.take(limit);
  } else if (paginationArgs.last && paginationArgs.before) { // REVERSE pagination
    const offsetId = Number(
      Buffer.from(paginationArgs.before, 'base64').toString('ascii'),
    );
    logger.verbose(`Paginate BeforeID: ${offsetId}`);

    const limit = paginationArgs.last ?? defaultLimit;

    query.where({ [cursorColumn]: LessThan(offsetId) }).take(limit);
  }

  const result: any[] = await query.getMany();

  const startCursorId: number =
    result.length > 0 ? result[0][cursorColumn] : null;
  const endCursorId: number =
    result.length > 0 ? result.slice(-1)[0][cursorColumn] : null;

  const beforeQuery = totalCountQuery.clone();

  const afterQuery = beforeQuery.clone();

  let countBefore = 0;
  let countAfter = 0;
  if (
    beforeQuery.expressionMap.wheres &&
    beforeQuery.expressionMap.wheres.length
  ) {
    countBefore = await beforeQuery
      .andWhere(`${cursorColumn} < :cursor`, { cursor: startCursorId })
      .getCount();
    countAfter = await afterQuery
      .andWhere(`${cursorColumn} > :cursor`, { cursor: endCursorId })
      .getCount();
  } else {
    countBefore = await beforeQuery
      .where(`${cursorColumn} < :cursor`, { cursor: startCursorId })
      .getCount();

    countAfter = await afterQuery
      .where(`${cursorColumn} > :cursor`, { cursor: endCursorId })
      .getCount();
  }

  logger.debug(`CountBefore:${countBefore}`);
  logger.debug(`CountAfter:${countAfter}`);

  const edges = result.map((value) => {
    return {
      node: value,
      cursor: Buffer.from(`${value[cursorColumn]}`).toString('base64'),
    };
  });

  const pageInfo = new CursorPageInfo();
  pageInfo.startCursor = edges.length > 0 ? edges[0].cursor : undefined;
  pageInfo.endCursor = edges.length > 0 ? edges.slice(-1)[0].cursor : undefined;

  pageInfo.hasNextPage = countAfter > 0;
  pageInfo.hasPreviousPage = countBefore > 0;
  // pageInfo.countBefore = countBefore;
  // pageInfo.countNext = countAfter;
  // pageInfo.countCurrent = edges.length;
  pageInfo.countTotal = countAfter + countBefore + edges.length;

  return { nodes: result, pageInfo };
}
