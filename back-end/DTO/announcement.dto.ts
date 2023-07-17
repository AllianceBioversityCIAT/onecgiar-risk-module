
export class cerateAnnouncementReq {
    subject: string;
    description: string;
    status: boolean;
}

export class cerateAnnouncementRes {
    subject: string;
    description: string;
    status: boolean;
    sendDate: Date;
    updatedAt: Date;
    id: number;
    createdAt: Date;
}

export class sendAnnouncementReq {
    contentType: string;
    Authorization: string;
}


export class sendTestReq {
    id: number;
    email: string;
}

