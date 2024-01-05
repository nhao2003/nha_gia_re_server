import IReport from '../src/domain/databases/interfaces/IReport';
import Report from '../src/domain/databases/entity/Report';
import fs from 'fs';
import { genArrayPictureUrl, genRandomDate, genUUID, generateRandomText } from './gen';
import { ReportStatus, ReportType, ReportContentType } from '../src/constants/enum';
import { AppDataSource } from '../src/app/database';
import { Repository } from 'typeorm';
const reports = JSON.parse(fs.readFileSync('sample/reports.json', 'utf-8'));

AppDataSource.initialize().then(async (dataSource) => {
  const reportRepository: Repository<IReport> = dataSource.getRepository(Report);
  const res = await reportRepository.save(reports);
  console.log(res);
});
