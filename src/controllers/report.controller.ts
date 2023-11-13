import { Request, Response } from 'express';
import ReportService from '../services/report.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { buildBaseQuery } from '~/utils/build_query';
class ReportController {
    
    public readonly getAllReport = wrapRequestHandler(async (req: Request, res: Response) => {
        const query = buildBaseQuery(req.query);
        const reports = await ReportService.getAllByQuery(query);
        res.json(reports);
    });

    public readonly getAllByQuery = wrapRequestHandler(async (req: Request, res: Response) => {
        const query = buildBaseQuery(req);
        const reports = await ReportService.getAllByQuery(query);
        res.json(reports);
    });

    public readonly updateReport = wrapRequestHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const report = await ReportService.updateReportStatus(id, req.body.status);
        res.json(report);
    });
}

export default new ReportController();