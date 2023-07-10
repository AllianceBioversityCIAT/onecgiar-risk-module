import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryGroup } from 'entities/categories-groups';
import { Repository } from 'typeorm';

@Controller('categories-groups')
export class CategoriesGroupsController {
    constructor(@InjectRepository(CategoryGroup)public CategoryGroupRepo: Repository<CategoryGroup>) {}

    @ApiCreatedResponse({
        description: '',
        type: [CategoryGroup],
    })
    @Get()
    get() {
        return this.CategoryGroupRepo.find();
    }
}
