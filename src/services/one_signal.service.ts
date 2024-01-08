import { Service } from 'typedi';
import * as OneSignal from '@onesignal/node-onesignal';
import appConfig from '../constants/configs';
import { on } from 'nodemailer/lib/xoauth2';
@Service()
class OneSignalService {
  private client: OneSignal.DefaultApi;
  private userKey: string;
  private appKey: string;
  private appId: string;
  constructor() {
    this.appId = appConfig.OneSignal.appId as string;
    this.userKey = appConfig.OneSignal.userKey as string;
    this.appKey = appConfig.OneSignal.appKey as string;
    const configuration = OneSignal.createConfiguration({
      userKey: this.userKey,
      appKey: this.appKey,
    });
    this.client = new OneSignal.DefaultApi(configuration);
  }

  public async createNotification(
    data: Partial<OneSignal.Notification>,
  ): Promise<OneSignal.CreateNotificationSuccessResponse> {
    // Copy data to notification
    const notification = { ...data } as OneSignal.Notification;
    notification.app_id = this.appId;
    return await this.client.createNotification(notification);
  }
}

export default OneSignalService;

// const oneSignalService = new OneSignalService();

// Send notification to only 1a9a5785-721a-4bb5-beb7-9d752e2070d4 user

// oneSignalService
//   .createNotification({
//     contents: {
//       en: 'Test notification for 1a9a5785-721a-4bb5-beb7-9d752e2070d4',
//     },
//     include_external_user_ids: ['1a9a5785-721a-4bb5-beb7-9d752e2070d4'],
//   })
//   .then((res) => {
//     console.log('Success: \n', res);
//   })
//   .catch((err) => console.log('Error: \n', err));
