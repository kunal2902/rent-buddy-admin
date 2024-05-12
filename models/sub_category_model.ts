import { UserModel, CategoryModel, ItemModel } from '@/models';

export interface SubCategoryModel {
    sub_category_id: string;
    name: string;
    icon?: string;
    created_by_id: string;
    created_by: UserModel;
    category_id: string;
    category: CategoryModel;
    created_at: Date;
    is_disabled: boolean;
    is_deleted: boolean;
    items: ItemModel[];
}
