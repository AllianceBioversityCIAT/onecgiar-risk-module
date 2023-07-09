import { Body, Controller, Delete, Get, Param, Patch, Post, Put, StreamableFile } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { RiskCategory } from 'entities/risk-category.entity';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';
@ApiTags('Risk Categories')
@Controller('risk-categories')
export class RiskCategoriesController {
  constructor(
    @InjectRepository(RiskCategory)
    public riskcatRepository: Repository<RiskCategory>,
  ) {}
  @ApiCreatedResponse({
    description: '',
    type: [RiskCategory],
  })
  @Get()
  get() {
    return this.riskcatRepository.find({order:{title:'ASC'}});
  }

  @Put()
  updateCategory(@Body() data: any) {
    const category = this.riskcatRepository.create();
    Object.assign(category, data);
    return this.riskcatRepository.save(category, { reload: true });
  }

  @Post()
  async addCategory(@Body() data: any) {
    const category = this.riskcatRepository.create();
    Object.assign(category, data);
    await this.riskcatRepository.save(category, { reload: true });

    return category;
  }

  @Delete(':id')
  deleteCategory(@Param('id') id:number) {
    return this.riskcatRepository.delete(id)
  }

  @Patch()
  async disabledCategory(@Body() data: any) {
    const category = await this.riskcatRepository.findOne({ where : { id : data.item.id } });
    if(data.act.action == 'disabledCatigory') {
      category.disabled = false;
      await this.riskcatRepository.save(category);
      return true
    }
    else {
      category.disabled = true;
      await this.riskcatRepository.save(category);
      return true
    }

  }

  @Get('export/all')
  async export() {
    let categories = await this.riskcatRepository.find();

    const file_name = 'All-Users.xlsx';
    var wb = XLSX.utils.book_new();

    const ws = XLSX.utils.json_to_sheet(categories);

    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    await XLSX.writeFile(wb, join(process.cwd(), 'generated_files', file_name));
    const file = createReadStream(
      join(process.cwd(), 'generated_files', file_name),
    );

    setTimeout(async () => {
      try {
        await unlink(join(process.cwd(), 'generated_files', file_name));
      } catch (e) {}
    }, 9000);
    return new StreamableFile(file, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      disposition: `attachment; filename="${file_name}"`,
    });
  }
}
