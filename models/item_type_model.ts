import { UserModel, ItemModel } from "@/models";

export interface ItemTypeModel {
    item_type_id: string;
    name: string;
    icon?: string;
    created_by_id: string;
    created_by: UserModel;
    created_at: Date;
    is_disabled: boolean;
    is_deleted: boolean;
    items: ItemModel[];
}
