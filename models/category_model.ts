import { SubCategoryModel, ItemModel, UserModel } from '@/models';

export interface CategoryModel {
    category_id: string;
    name: string;
    icon?: string;
    created_by_id: string;
    created_by: UserModel;
    created_at: Date;
    is_disabled: boolean;
    is_deleted: boolean;
    sub_categories: SubCategoryModel[];
    items: ItemModel[];
}
