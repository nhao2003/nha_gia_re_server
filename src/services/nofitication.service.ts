import { Service } from 'typedi';
import OneSignalService from './one_signal.service';
import * as OneSignal from '@onesignal/node-onesignal';
import { DataSource, Repository } from 'typeorm';
import { Notification } from '~/domain/databases/entity/Notification';
import { NotificationType } from '~/constants/enum';
import CommonServices from './common.service';
import appConfig from '~/constants/configs';
interface NotificationData {
  type: NotificationType;
  headings: {
    en?: string;
    vi?: string;
  };
  content: {
    en?: string;
    vi?: string;
  };
  data?: any;
  include_external_user_ids?: string[];
  big_picture?: string;
  name?: string;
  url?: string;
}
@Service()
class NotificationService extends CommonServices {
  private notificationRepo: Repository<Notification>;
  constructor(
    private oneSignalService: OneSignalService,
    dataSource: DataSource,
  ) {
    super(Notification, dataSource);
    this.notificationRepo = this.repository as Repository<Notification>;
  }
  createNotification(data: NotificationData) {
    const notification = new Notification();
    notification.title = data.headings?.vi || '';
    notification.content = data.content?.vi || '';
    notification.data = data.data;
    notification.url = data.url;
    notification.image = data.big_picture;
    notification.type = data.type;
    // return this.oneSignalService.createNotification(data);
    const isAll = data.include_external_user_ids === undefined;
    if (isAll) {
      const send = this.oneSignalService.createNotification({
        ...data,
        include_external_user_ids: undefined,
        included_segments: ['All'],
      });
      const save = this.notificationRepo.save(notification);
      console.log('Send all', send);
      return Promise.all([send, save]);
    } else {
      const sendAll = this.oneSignalService.createNotification({
        url: data.url,
        headings: data.headings,
        contents: data.content,
        data: data.data,
        include_external_user_ids: data.include_external_user_ids as string[],
        big_picture: data.big_picture,
        included_segments: undefined,
      });

      const notifications: Notification[] = (data.include_external_user_ids ?? []).map((player_id) => {
        const notification = new Notification();
        notification.title = data.headings?.vi || '';
        notification.content = data.content?.vi || '';
        notification.data = data.data;
        notification.url = data.url;
        notification.image = data.big_picture;
        notification.type = data.type;
        notification.user_id = player_id;
        return notification;
      });
      const saveAll = this.notificationRepo.save(notifications);
      console.log('Send for some', sendAll);
      return Promise.all([sendAll, saveAll]);
    }
  }

  async getNotificationByUserId(query: { user_id: string; page: string }) {
    const page = isNaN(Number(query.page)) ? 1 : Number(query.page);
    const queryBuilder = this.notificationRepo
      .createQueryBuilder('notification')
      .where({
        user_id: query.user_id,
      })
      .orWhere('notification.user_id IS NULL')
      .skip((page - 1) * appConfig.ResultPerPage)
      .take(appConfig.ResultPerPage)
      .orderBy('notification.created_at', 'DESC');
    const res = await Promise.all([queryBuilder.getMany(), queryBuilder.getCount()]);
    return {
      num_of_pages: Math.ceil(res[1] / appConfig.ResultPerPage),
      data: res[0],
    };
  }
}

export { NotificationService };
