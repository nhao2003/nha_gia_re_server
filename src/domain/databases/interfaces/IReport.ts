import { ReportStatus, ReportType, ReportContentType } from "~/constants/enum";

interface IReport {
    id: string;
    user_id: string;
    reported_id: string;
    status: ReportStatus;
    type: ReportType;
    content_type: ReportContentType;
    description: string;
    images?: string[] | null;
    created_date: Date;
}

export default IReport;
