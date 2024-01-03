import { Service } from 'typedi';
import * as OneSignal from '@onesignal/node-onesignal';
import appConfig from '../constants/configs';
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
    notification.name = 'Notification Name';
    if (!notification.included_segments) {
      notification.included_segments = ['All'];
    }
    return await this.client.createNotification(notification);
  }
}

export default OneSignalService;