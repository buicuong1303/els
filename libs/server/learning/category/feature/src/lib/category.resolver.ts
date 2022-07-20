import { Category } from '@els/server/learning/category/data-access/entities';
import { CategoryService } from '@els/server/learning/category/data-access/services';
import { GetCategoryDetailsArgs } from '@els/server/learning/category/data-access/types';
import { GqlContext } from '@els/server/learning/common';
import { SpecializationService } from '@els/server/learning/specialization/data-access/services';
import { Auth, AuthGuard, checkCache, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import {
  Args, Context, Query, Resolver
} from '@nestjs/graphql';
@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly _categoryService: CategoryService,
    private readonly _specializationService: SpecializationService
  ) {}
  @Query(() => [Category], { name: 'categories' })
  @UseGuards(AuthGuard)
  async categories(@Context() ctx: GqlContext) {
    return checkCache(ctx.cache, 'data-caching:categories',  this._categoryService.getAllCategories.bind(this._categoryService), 30 * 24 * 60 * 60);
  };

  @Query(() => Category, { name: 'categoryDetails' })
  @UseGuards(AuthGuard)
  async categoryDetails(@Args() getCategoryDetailsArgs: GetCategoryDetailsArgs, @Auth() identity: Identity) {
    const newCategory = await this._categoryService.getCategoryDetails(getCategoryDetailsArgs, identity);
    return newCategory;
  };

  // @ResolveField(() => [Specialization], { name: 'specializations' })
  // async specializations(@Parent() category: Category,  @Context() ctx: GqlContext) {
  //   return checkCache(ctx.cache, `data-caching:specializations:category_${category.id}`,  this._specializationService.findSpecializationsByCategory.bind(this._specializationService, category, identity ), 10);
  // };

};
