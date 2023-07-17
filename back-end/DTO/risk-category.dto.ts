export class getRiskCategory {
    id: number;
    title: string;
    description: string;
    disabled: boolean;
    category_group_id:  number;
    category_group_name: string;
    category_group_description:string;
}

//////////////////

export class createRiskCategoryReq {
    id: number;
    title: string;
    description: string;
    category_group_id:  number;
}

export class createRiskCategoryRes {
    id: number;
    title: string;
    description: string;
    category_group_id:  number;
    disabled: boolean;
}
//////////////////


export class disabledCategoryReq {
    act: {
        title: string;
        action: string;
        icon: string;
    };
    item: getRiskCategory;
}
export class disabledCategoryRes {
    disabled: boolean;
}


//////////////////
