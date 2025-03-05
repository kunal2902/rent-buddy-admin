import { UserModel } from "@/models/user_model";

export interface WarrantyModel {
	warranty_id: string;
	warranty_title: string;
	price: number;
	min_price: number;
	max_price: number;
	created_by_id: string;
	created_by: UserModel;
	created_at: Date;
	is_disabled: boolean;
	is_deleted: boolean;
}
