import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryGroup } from 'entities/categories-groups';
import { AdminRolesGuard } from 'src/auth/admin-roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Repository } from 'typeorm';
@ApiBearerAuth()
@ApiTags('Categories-groups')
@Controller('categories-groups')
@UseGuards(JwtAuthGuard, AdminRolesGuard)
export class CategoriesGroupsController {
    constructor(@InjectRepository(CategoryGroup)public CategoryGroupRepo: Repository<CategoryGroup>) {}
    @Roles()
    @Get()
    get() {
        return this.CategoryGroupRepo.find();
    }
}
