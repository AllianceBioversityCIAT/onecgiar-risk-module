import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryGroup } from 'entities/categories-groups';
import { Repository } from 'typeorm';

@ApiTags('categories-groups')
@Controller('categories-groups')
export class CategoriesGroupsController {
    constructor(@InjectRepository(CategoryGroup)public CategoryGroupRepo: Repository<CategoryGroup>) {}

    @Get()
    get() {
        return this.CategoryGroupRepo.find();
    }
}
