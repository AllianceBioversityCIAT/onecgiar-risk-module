export class getInitiativeScor {
    id: number;
    official_code: string;
    name: string;
    status: boolean;
    target_impact: number;
    target_likelihood: number;
    current_impact: number;
    current_likelihood: number;
}

export class getCategoriesLevels {
    id: number;
    title: string;
    target_level: number;
    current_level: number;
}

export class getCategoriesCount {
    id: number;
    title: string;
    total_count: string;
}

export class getCategoriesGroupsCount {
    id: number;
    name: string;
    total_count: string;
}


export class getDashboardStatus {
    id: number;
    title: string;
    total_actions: string;
}



