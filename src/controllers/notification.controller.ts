import { Request, Response } from 'express';
import { Service } from 'typedi';
import ServerCodes from '~/constants/server_codes';
import { NotificationService } from '~/services/nofitication.service';
import { buildBaseQuery } from '~/utils/build_query';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';

@Service()
class NotificationController {
  constructor(private notificationService: NotificationService) {}

  getNotifications = wrapRequestHandler(async (req: Request, res: Response) => {
    const notifications = await this.notificationService.getNotificationByUserId({
      user_id: req.user!.id,
      page: req.query.page as string,
    });

    res.json({
      status: 'success',
      message: 'Get notifications successfully',
      code: ServerCodes.CommomCode.Success,
      num_of_pages: notifications.num_of_pages,
      result: notifications.data,
    });
  });
}

export { NotificationController };
