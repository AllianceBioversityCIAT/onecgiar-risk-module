import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Variables } from 'entities/variables.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VariablesService {
    constructor(  @InjectRepository(Variables)
    public variablesRepository: Repository<Variables>,){}
    getVariable() {
        return this.variablesRepository.findOne({where: { id: 9 }})
    }
    async changeVariable(value: any) {
        const publish =  await this.variablesRepository.findOne({ where: { id: 9 } });
        publish.value =  value.status;
        return await this.variablesRepository.save(publish);
    }
}
