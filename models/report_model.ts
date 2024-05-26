import { UserModel } from "@/models";

export interface ReportModel {
    report_id: string;
    name: string;
    created_by_id: string;
    created_by: UserModel;
    created_at: Date;
    is_disabled: boolean;
    is_deleted: boolean;
}
