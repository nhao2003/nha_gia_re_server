import { Request, Response } from 'express';
import ReportService from '../services/report.service';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { buildBaseQuery } from '~/utils/build_query';
import AppResponse from '~/models/AppRespone';
import { Service } from 'typedi';

@Service()
class ReportController {
  private reportService: ReportService;
  constructor(reportService: ReportService) {
    this.reportService = reportService;
  }
  public readonly getAllReport = wrapRequestHandler(async (req: Request, res: Response) => {
    const query = buildBaseQuery(req.query);
    const reports = await this.reportService.getAllByQuery(query);
    const appRes: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Get all reports successfully',
      num_of_pages: reports.num_of_pages,
      result: reports.data,
    };
    res.json(appRes);
  });

  public readonly updateReport = wrapRequestHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const report = await this.reportService.updateReportStatus(id, req.body.status);
    const appRes: AppResponse = {
      status: 'success',
      code: 200,
      message: 'Update report successfully',
      result: report,
    };
    res.json(appRes);
  });
}

export default ReportController;
