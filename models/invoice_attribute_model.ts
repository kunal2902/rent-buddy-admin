import { CustomAttributeModel } from "@/models/custom_attribute_model";
import { ReportModel } from "@/models/report_model";

export interface InvoiceAttributeModel {
	invoice_attribute_id: string;
	custom_attribute_id?: string;
	invoice_id: string;
	calculated_amount: number;
	created_at: Date;
	custom_attribute?: CustomAttributeModel;
	invoice: ReportModel;
}
