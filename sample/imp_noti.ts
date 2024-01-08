import { Notification } from '../src/domain/databases/entity/Notification';
import fs from 'fs';
import { genArrayPictureUrl, genRandomDate, genUUID, generateRandomText } from './gen';
import { ReportStatus, ReportType, ReportContentType } from '../src/constants/enum';
import { AppDataSource } from '../src/app/database';
import { Repository } from 'typeorm';
const reports = JSON.parse(fs.readFileSync('sample/notification.json', 'utf-8'));

AppDataSource.initialize().then(async (dataSource) => {
  const reportRepository: Repository<Notification> = dataSource.getRepository(Notification);
  await reportRepository.delete({});
  const res = await reportRepository.save(reports);
  console.log(res);
});
