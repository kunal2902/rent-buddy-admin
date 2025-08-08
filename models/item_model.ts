import { ItemTypeModel, CategoryModel, SubCategoryModel, UserModel, CartItemModel, InvoiceItemModel } from "@/models";
import { ItemCustomAttribute } from "@/models/item_custom_attribute";

export interface ItemModel {
	custom_attributes: ItemCustomAttribute[];
    item_id: string;
    item_type_id: string;
    type: ItemTypeModel;
    category_id: string;
    category: CategoryModel;
    sub_category_id: string;
    sub_category: SubCategoryModel;
    tag_ids: string[];
    add_ons: string[];
    name: string;
    internal_name?: string;
    description?: string;
    short_description?: string;
    sku?: string;
    images: string[];
    icon?: string;
    price: string;
    msrp: string;
    // stock_quantity: string;
    custom_attribute_ids: string[];
    created_by_id: string;
    created_by: UserModel;
    created_at: Date;
    is_disabled: boolean;
    is_deleted: boolean;
    cart_items: CartItemModel[];
    invoice_items: InvoiceItemModel[];
}
