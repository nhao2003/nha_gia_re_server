import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../src/app/database';
import { AccountVerificationRequest } from '../src/domain/databases/entity/AccountVerificationRequest';
import { Repository } from 'typeorm';

const requests = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sample' ,'account_verification_requests.json'), 'utf8'));

AppDataSource.initialize().then(async (dataSource) => {
  const accountVerificationRequestRepository: Repository<AccountVerificationRequest> =
    dataSource.getRepository(AccountVerificationRequest);
  await accountVerificationRequestRepository.save(requests);
});
