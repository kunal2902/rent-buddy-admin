import { LocationModel, UserModel, CartModel, InvoiceModel } from "@/models";

export interface CustomerModel {
    is_disabled: boolean;
    is_deleted: boolean;
    customer_id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    location_id?: string;
    location?: LocationModel;
    created_at?: Date;
    created_by_id?: string;
    created_by?: UserModel;
    updated_at?: Date;
    created_location_id?: string;
    created_location?: Location;
    carts: CartModel[];
    invoices: InvoiceModel[];
    state: string;
    city: string;
    pinCode: string;
}
