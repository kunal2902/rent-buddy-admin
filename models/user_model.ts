import {
	CartModel,
	ItemTypeModel,
	CategoryModel,
	SubCategoryModel,
	TagModel,
	CustomAttributeModel,
	AddOnModel,
	ItemModel,
	InvoiceModel,
	CustomerModel,
	RoleModel,
	ActivityLogModel,
} from "@/models";

export interface UserModel {
    user_id: string;
    name: string;
    phone?: string;
    email: string;
    username: string;
    password: string;
    type?: string;
    grade?: string;
    commission_percent?: string;
    ext_warranty_value?: string;
    designated_location?: string;
    created_at?: Date;
    updated_at?: Date;
    basic_pay?: string;
    role_id?: string;
    carts: CartModel[];
    item_types: ItemTypeModel[];
    categories: CategoryModel[];
    sub_categories: SubCategoryModel[];
    tags: TagModel[];
    custom_attributes: CustomAttributeModel[];
    add_ons: AddOnModel[];
    items: ItemModel[];
    invoices: InvoiceModel[];
    customers: CustomerModel[];
    roles_created: RoleModel[];
    role?: RoleModel;
    activity_logs: ActivityLogModel[];
}
