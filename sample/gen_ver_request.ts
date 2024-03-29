import { IAccountVerificationRequest } from '../src/domain/databases/entity/AccountVerificationRequest';
import fs from 'fs';
import { genArrayPictureUrl, genRandomDate, genUUID, generateRandomText } from './gen';
const requests: IAccountVerificationRequest[] = [];

const userIds = [
  '891d88a3-3f3b-45d7-9bea-55398aa02b06',
  '436660d3-98b4-45d9-98c8-098c603a442b',
  '28223664-4747-424e-b2e3-27ace26bc553',
  '280d8b28-07ae-43e7-a54e-6468b6acf519',
  '1a9a5785-721a-4bb5-beb7-9d752e2070d4',
  '5ebc825b-48dc-4b33-910d-a711999934c4',
  'd45afc3e-05e0-41a7-b38d-7e801bf92f04',
  '8bc42aed-0036-45a2-8e1d-8041afe12d23',
  'cda34506-be46-4dcb-94f3-e92cf8868222',
  'eb9c2609-0dc7-426b-9347-d59795d517a9',
  'd9f4a336-f029-4638-9815-9a0876dc159f',
  '346ce7ff-9c1e-43f5-8450-1296ece15692',
  'a9eb0d7d-025b-48fa-9ff7-b792b249c159',
  '032eb0aa-df19-4e4c-9b10-19ede9606f91',
  'b9776123-9188-4e95-995d-44311cfe7445',
  'acd91d26-4e9c-4807-94b7-57015dd554b8',
  '8f021f08-c21e-4d5b-8880-bd8954f37e45',
];

for ( const user_id of userIds) {
  const random = 123456789102;
  const is_verified = Math.random() > 0.9;
  const request: IAccountVerificationRequest = {
    id: genUUID(),
    is_verified,
    reviewed_at: is_verified ? new Date() : null,
    rejected_info: is_verified ? null : generateRandomText(10),
    user_id,
    request_date: new Date().toISOString(),
    front_identity_card_image_link: genArrayPictureUrl(1)[0],
    back_identity_card_image_link: genArrayPictureUrl(1)[0],
    portrait_image_link: genArrayPictureUrl(1)[0],
    full_name: generateRandomText(10),
    sex: Math.random() > 0.5,
    dob: genRandomDate(new Date(1970, 1, 1), new Date()).toISOString(),
    identity_card_no: (random).toString(),
    identity_card_issued_date: genRandomDate(new Date(2000, 1, 1), new Date()).toISOString(),
    issued_by: 'Công an Hà Nội',
  };
  requests.push(request);
}

fs.writeFileSync('sample/account_verification_requests.json', JSON.stringify(requests));
