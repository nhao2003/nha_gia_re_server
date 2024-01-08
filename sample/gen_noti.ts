import { INotification } from '../src/domain/databases/entity/Notification';
import fs from 'fs';
import { genArrayPictureUrl, genRandomDate, genUUID, generateRandomText } from './gen';
import { NotificationType } from '../src/constants/enum';
const notifications: INotification[] = [];
const userIds = [
  '1a9a5785-721a-4bb5-beb7-9d752e2070d4',
  '5ebc825b-48dc-4b33-910d-a711999934c4',
  'd45afc3e-05e0-41a7-b38d-7e801bf92f04',
  '8bc42aed-0036-45a2-8e1d-8041afe12d23',
];

for (let i = 0; i < 100; i++) {
  const user_id = userIds[Math.floor(Math.random() * userIds.length)];
  const type = Object.values(NotificationType)[Math.floor(Math.random() * Object.values(NotificationType).length)];
  const request: INotification = {
    id: genUUID(),
    user_id: Math.random() > 0.5 ? user_id : undefined,
    type,
    title: generateRandomText(5),
    content: generateRandomText(10),
    is_read: Math.random() > 0.5,
    image: Math.random() > 0.5 ? genArrayPictureUrl(1)[0] : undefined,
    url: undefined,
    created_at: genRandomDate(new Date(2021, 0, 1), new Date()),
  };
  notifications.push(request);
}

fs.writeFileSync('sample/notification.json', JSON.stringify(notifications, null, 2));
