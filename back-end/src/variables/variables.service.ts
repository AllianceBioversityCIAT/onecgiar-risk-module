import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Variables } from 'entities/variables.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VariablesService {
    constructor(  @InjectRepository(Variables)
    public variablesRepository: Repository<Variables>,){}
    getConstants() {
        return this.variablesRepository.find();
    }
    getVariable() {
        return this.variablesRepository.findOne({where: { id: 9 }})
    }
    async changeVariable(value: any) {
        const publish =  await this.variablesRepository.findOne({ where: { id: 9 } });
        publish.value =  value.status;
        return await this.variablesRepository.save(publish);
    }
    async editConstant(data: any) {
        try {
            const constant = await this.variablesRepository.findOne({ where : {id : data.id}});
            constant.label = data.label;
            constant.value = data.value;
            return await this.variablesRepository.save(constant);
        } catch (error) {
            console.error(error);
        }
    }
}
