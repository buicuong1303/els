import { ComplexityEstimatorArgs, Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Specialization } from '@els/server/learning/specialization/data-access/entities';
import { Category } from '@els/server/learning/category/data-access/entities';
import DataLoader = require('dataloader');
@Resolver(() => Specialization)
export class SpecializationResolver {

  @ResolveField(() => Category, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async category(
  @Parent() spec: Specialization,
    @Context('categoriesLoader') categoriesLoader: DataLoader<string, Specialization>
  ) {
    return categoriesLoader.load(spec.categoryId);
  }
}