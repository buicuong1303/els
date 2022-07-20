import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@els/server/learning/category/data-access/entities';
import { CategoryService } from '@els/server/learning/category/data-access/services';
import { CategoryResolver } from './category.resolver';
import { SpecializationModule } from '@els/server/learning/specialization/feature';
@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    SpecializationModule,
  ],
  controllers: [],
  providers: [CategoryService, CategoryResolver],
  exports: [CategoryService],
})
export class CategoryModule {}
