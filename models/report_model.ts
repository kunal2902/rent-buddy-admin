import { UserModel } from "@/models/user_model";
import { CustomerModel } from "@/models/customer_model";
import { InvoiceItemModel } from "@/models/invoice_item_model";
import { InvoiceAttributeModel } from "@/models/invoice_attribute_model";

export interface ReportModel {
    invoice_id: string;
    payment_method?: string;
    transaction_id?: string;
    transaction_time?: Date;
    transaction_detail?: object;
    delivery_time?: Date;
    delivery_method?: string;
    delivery_note?: string;
    total_extra_charges?: number;
    total_base_price?: number;
    total_payable_amount?: number;
    total_selling_amount?: number;
    sold_time?: Date;
    customer_id?: string;
    salesperson_id?: string;
    created_at: Date;
    customer: CustomerModel;
    salesperson?: UserModel;
    invoice_items: InvoiceItemModel[];
    invoice_attributes: InvoiceAttributeModel[];
}
