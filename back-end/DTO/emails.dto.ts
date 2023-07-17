export class getEmailsDto {
    items: Array<items>
    meta: {
        totalItems: number;
        itemCount:  number;
        itemsPerPage:  number;
        totalPages:  number;
        currentPage:  number;
    } 
}

export class items {
    id: number;
    name: string;
    subject: string;
    email: string;
    emailBody: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class filterStatusReq {
    status: boolean;
}