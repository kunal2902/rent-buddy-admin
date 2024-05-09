import { CartItemModel, CustomerModel, InvoiceModel, LocationModel, UserModel } from "@/models";

export interface CartModel {
    cart_id: string;
    customer_id?: string;
    salesperson_id?: string;
    created_at?: Date;
    location_id?: string;
    updated_at?: Date;
    total_selling_price?: string;
    total_gst?: string;
    total_pst?: string;
    total_ehf_marr_fees?: string;
    total_extended_warranty?: string;
    total_payable_price?: string;
    cart_items: CartItemModel[];
    customer?: CustomerModel;
    location?: LocationModel;
    salesperson?: UserModel;
    invoices: InvoiceModel[];
}
