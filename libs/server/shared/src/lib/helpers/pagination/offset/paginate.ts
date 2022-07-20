import { OffsetPageInfo } from './page-info';
import { PaginationArgs } from './pagination.args';
import { SelectQueryBuilder, In } from 'typeorm';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import { checkCache } from '../../../utils';

export async function paginate<T>(
  query: SelectQueryBuilder<T>,
  paginationArgs: PaginationArgs | any,
  cache: BaseRedisCache | null = null,
  ttl = 0,
  cacheConditions: string[] = []
): Promise<any> {
  // pagination ordering

  if (paginationArgs.ids && paginationArgs.ids.length > 0) {
    const result = await query
      .where({ id: In(paginationArgs.ids) })
      .getMany();

    return {
      nodes: result,
    };
  }

  if (paginationArgs['pageNumber'] && paginationArgs['limit']) {
    if ( paginationArgs['limit'] !== -1) 
      query
        .skip(+(paginationArgs['pageNumber'] - 1) * paginationArgs['limit'])
        .take(paginationArgs['limit']);
   
    if (cache) {
      if (Object.keys(paginationArgs).every((key: string) => cacheConditions.includes(key)) && ( paginationArgs['pageNumber'] === 1 ||  paginationArgs['pageNumber'] === 2) ) {
        return checkCache(cache, `data-caching:${query.expressionMap.mainAlias?.name}:${
          Object.keys(paginationArgs).reduce((rs:string, key: string, index: number) => {
            if (index !== Object.keys(paginationArgs).length - 1 ) {
              return rs += `${key}_${paginationArgs[key]}:`; 
            }
            return rs += `${key}_${paginationArgs[key]}`; 
          }, '')
        }`,  async () => {
          const result: any[] = await query.getMany();
          const total = await query.getCount();
          return {
            nodes: result,
            pageInfo: {
              total,
            } as OffsetPageInfo,
          };
        }, ttl);
      }
       
    }  
    const result: any[] = await query.getMany();
    const total = await query.getCount();
    return {
      nodes: result,
      pageInfo: {
        total,
      } as OffsetPageInfo,
    };
    
   
  }

  // FORWARD pagination
  // if (paginationArgs.first) {
  //   if (paginationArgs.after) {
  //     const offsetId = Number(
  //       Buffer.from(paginationArgs.after, 'base64').toString('ascii'),
  //     );
  //     logger.verbose(`Paginate AfterID: ${offsetId}`);
  //     query.where({ [cursorColumn]: MoreThan(offsetId) });
  //   }

  //   const limit = paginationArgs.first ?? defaultLimit;
  //   query.take(limit);
  // }

  // REVERSE pagination
  // else if (paginationArgs.last && paginationArgs.before) {
  //   const offsetId = Number(
  //     Buffer.from(paginationArgs.before, 'base64').toString('ascii'),
  //   );
  //   logger.verbose(`Paginate BeforeID: ${offsetId}`);

  //   const limit = paginationArgs.last ?? defaultLimit;

  //   query.where({ [cursorColumn]: LessThan(offsetId) }).take(limit);
  // }
}
