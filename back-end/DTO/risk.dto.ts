/*************************GET**************************/
export class Mitigations {
    id: number;
    risk_id: number;
    description: string;
    mitigation_status_id: number;
      status: {
        id: number,
        title: string,
        description: string,
        createdAt: Date,
        updatedAt: Date
      }
    }  
  
  export class  GetRiskDto {
    id: number;
    initiative_id: number;
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
      id: number,
      title: string,
      description: string,
      category_group_id: number,
      disabled: boolean
    };
    initiative: {
      id: number,
      official_code: string,
      clarisa_id: number,
      name: string,
      parent_id: number,
      last_version_id: number,
      submit_date: Date,
      last_updated_date: Date,
      created_by_user_id: number,
      status: boolean,
      action_area_id: number
      };
      mitigations: Array<Mitigations>
      created_by: {
        id: number,
        first_name: string,
        last_name: string,
        email: string,
        role: string,
        full_name: string
      };
      risk_owner: {
        id: number,
        email: string,
        user_id: number,
        initiative_id: number,
        role: string,
        createdAt: Date,
        updatedAt: Date,
        user: string
      }
  }
  /*************************GET**************************/
  
  /*************************POST**************************/
  export class MitigationCreateRiskRequestDto {
    description:  string;
    mitigation_status_id: number;
  }
  
  export class MitigationCreateRiskResponseDto {
    risk_id: number;
    description:  string;
    mitigation_status_id: number;
    id:  number;
  }
  
  
  export class CreateRiskRequestDto {
    initiative_id: number;
    mitigations: Array<MitigationCreateRiskRequestDto>;
    title:  string;
    risk_raiser: string
    risk_owner_id:  number;
    description:  string;
    target_likelihood: number;
    target_impact:  number;
    current_likelihood: number;
    current_impact:  number;
    category_id:  number;
    due_date: Date;
  }
  
  export class CreateRiskResponseDto {
      initiative_id: number;
      title:  string;
      risk_owner_id:  number;
      description:  string;
      target_likelihood: number;
      target_impact:  number;
      current_likelihood: number;
      current_impact:  number;
      category_id:  number;
      due_date: Date;
      created_by_user_id:  number;
      mitigations: Array<MitigationCreateRiskResponseDto>;
      id:  number;
      redundant: boolean;
      top: number;
  }
  /*************************POST**************************/
  
  /*************************PUT**************************/
  export class MitigationUpdateRiskRequestDto {
    id: number;
    risk_id: number;
    description: string;
    mitigation_status_id: number;
    status: {
      id: number;
      title: string;
      description: string;
      createdAt:  Date;
      updatedAt: Date;
    }
  }
  
  export class UpdateRiskRequestDto {
    id: number;
    initiative_id: number;
    mitigations: Array<MitigationUpdateRiskRequestDto>;
    title:  string;
    risk_raiser: string
    risk_owner_id:  number;
    description:  string;
    target_likelihood: number;
    target_impact:  number;
    current_likelihood: number;
    current_impact:  number;
    category_id:  number;
    due_date: Date;
  }
  
  
  export class UpdateRiskResponseDto {
    id: number;
    initiative_id: number;
    mitigations: Array<MitigationUpdateRiskRequestDto>;
    created_by_user_id: number;
    title:  string;
    risk_raiser: string
    risk_owner_id:  number;
    description:  string;
    target_likelihood: number;
    target_impact:  number;
    current_likelihood: number;
    current_impact:  number;
    category_id:  number;
    due_date: Date;
  }
  /*************************PUT**************************/
  
  /*************************PATCH**************************/
  export class PatchRiskRequestDto {
    redundant: boolean;
  }
  
  export class PatchRiskResponseDto {
    id: number;
    initiative_id: number;
    created_by_user_id: number;
    title:  string;
    risk_owner_id:  number;
    description:  string;
    target_likelihood: number;
    target_impact:  number;
    current_likelihood: number;
    current_impact:  number;
    category_id:  number;
    due_date: Date;
    flag: boolean;
    redundant: boolean;
    top: number;
    target_level:number;
    current_level:number;
  }
  /*************************PATCH**************************/
  