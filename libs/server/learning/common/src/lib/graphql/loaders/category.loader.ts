/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as DataLoader from 'dataloader';

import { CategoryService } from '@els/server/learning/category/data-access/services';
import { Category } from '@els/server/learning/category/data-access/entities';
export const createCategoriesLoader = (categoryService: CategoryService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct languages
    const categories: Category[] = await categoryService.getCategoryByIds([
      ...ids,
    ]);
    const categoriesMap = new Map(
      categories.map((category) => [category.id, category])
    );
    return ids.map((id) => categoriesMap.get(id));
  });
};
