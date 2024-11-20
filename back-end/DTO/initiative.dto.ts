import { OmitType, PickType } from "@nestjs/swagger";
import { getUsers } from './users.dto';
import { Risk } from "entities/risk.entity";
import { RiskCategory } from "entities/risk-category.entity";

//////////////////////////////////////////////////
export class getSciencePrograms{
    id: number;
    official_code: string;
    clarisa_id: number;
    name: string;
    parent_id: number;
    last_version_id: number;
    submit_date: Date;
    last_updated_date: Date;
    created_by_user_id: number;
    status: boolean;
    action_area_id: number;
    risks: Array<riskGetSciencePrograms>;
    roles: Array<roles>;
}



export class riskGetSciencePrograms {
    id: number;
    science_programs_id: number;
    title: string;
    risk_owner_id: number;
    description: string;
    target_likelihood: number;
    target_impact: number;
    target_level: number;
    current_likelihood: number;
    current_impact: number;
    current_level: number;
    flag: boolean;
    category_id: number;
    redundant: boolean;
    top: number;
    due_date: Date;
    created_by_user_id: number; 
    category: {
        id: number;
        title: string;
        description: string;
        category_group_id: number;
        disabled: boolean;
    };
    risk_owner: {
        id: number;
        email: string;
        user_id: number;
        science_programs_id:  number;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }
}

export class roles {
    id: number;
    email: string;
    user_id: number;
    science_programs_id: number;
    role: string;
    createdAt:  Date;
    updatedAt:  Date;
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        role: string;
        full_name: string;
    }
}

//////////////////////////////////////////////////






//////////////////////////////////////////////////





export class getScienceProgramsById{
    id: number;
    official_code: string;
    clarisa_id: number;
    name: string;
    parent_id: number;
    last_version_id: number;
    submit_date: Date;
    last_updated_date: Date;
    created_by_user_id: number;
    status: boolean;
    action_area_id: number;
    risks: Array<riskGetScienceProgramsById>;
    created_by: user;
    roles: Array<roles>;
}



export class riskGetScienceProgramsById {
    id: number;
    science_programs_id: number;
    title: string;
    risk_owner_id: number;
    description: string;
    target_likelihood: number;
    target_impact: number;
    target_level: number;
    current_likelihood: number;
    current_impact: number;
    current_level: number;
    flag: boolean;
    category_id: number;
    redundant: boolean;
    top: number;
    due_date: Date;
    created_by_user_id: number; 
    category: {
        id: number;
        title: string;
        description: string;
        category_group_id: number;
        disabled: boolean;
    };
    mitigations: Array<mitigation>;
    created_by: user;
    risk_owner: {
        id: number;
        email: string;
        user_id: number;
        science_programs_id:  number;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }
}

export class mitigation {
        id: number;
        risk_id: number;
        description: string;
        mitigation_status_id:number;
        status: {
            id: number;
            title: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
        }
}

export class user extends getUsers{}

//////////////////////////////////////////////////





/////////////////////////////////////////////////

export class  AllExcel extends riskGetScienceProgramsById{
    sciencePrograms: sciencePrograms;
}


export class sciencePrograms {
    id: number;
    official_code: string;
    clarisa_id:  string;
    name:  string;
    parent_id: number;
    last_version_id: number;
    submit_date: Date;
    last_updated_date: Date;
    created_by_user_id: number;
    status: boolean;
    action_area_id: number;
    roles: Array<roles>;
}

///////////////////////////////////////////////

///////////////////////////////////////////////


export class createVersion {
        id: number;
        official_code: string;
        clarisa_id: string;
        name: string;
        parent_id: number;
        last_version_id: number;
        submit_date: Date;
        last_updated_date: Date;
        created_by_user_id: number;
        status: boolean;
        action_area_id:number;
        risks: Array<riskForCreateVersion>
}

export class riskForCreateVersion extends PickType(Risk, [
    'id',
    'science_programs_id',
    'title',
    'risk_owner_id',
    'description',
    'target_likelihood',
    'target_impact',
    'target_level',
    'current_likelihood',
    'current_impact',
    'current_level',
    'flag',
    'category_id',
    'redundant',
    'top',
    'due_date',
    'created_by_user_id'
]){}


//req create version
export class reqBodyCreateVersion {
    science_programs_id: number;
    top: Array<riskForCreateVersion>
}
///////////////////////////////////////////////


///////////////////////////////////////////////
export class getAllCategories extends PickType(RiskCategory,['id','title','description','disabled']){}
///////////////////////////////////////////////




///////////////////////////////////////////////
export class getAllVersions extends getSciencePrograms {
    created_by: user;
}
///////////////////////////////////////////////


///////////////////////////////////////////////
export class getRoles {
    id: number;
    email: string;
    user_id: number;
    science_programs_id:  number;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    user: user;
}
///////////////////////////////////////////////

///////////////////////////////////////////////
export class createRoleReq{
    science_programs_id: number;
    email: string;
    user_id: number;
    role: string;
}

export class createRoleRes{
    id: number;
    science_programs_id: number;
    email: string;
    user_id: number;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
  ///////////////////////////////////////////////

  ///////////////////////////////////////////////
export class updateRoleReq extends createRoleReq{
    id:number;
}
export class updateRoleRes extends updateRoleReq{
    id:number;
    updatedAt: Date;
}
  ///////////////////////////////////////////////

  ///////////////////////////////////////////////
export class deleteRoleRes extends createRoleReq{
    createdAt: Date;
    updatedAt: Date;
}
  ///////////////////////////////////////////////

///////////////////////////////////////////////
export class TopSimilar {
    top: Array<top>
    similar: Array<similar>
}
export class top extends OmitType(riskGetSciencePrograms,['category','risk_owner']){}
export class similar extends OmitType(riskGetSciencePrograms,['category','risk_owner']){}

///////////////////////////////////////////////
