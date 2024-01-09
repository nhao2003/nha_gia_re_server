import { Service } from 'typedi';
import { DataSource, Repository } from 'typeorm';
import { NotificationType, PostStatus } from '~/constants/enum';
import { Developer } from '~/domain/databases/entity/Developer';
import { RealEstatePost } from '~/domain/databases/entity/RealEstatePost';
import { User } from '~/domain/databases/entity/User';
import { NotificationService } from './nofitication.service';

@Service()
class AdminService {
  private userRepo: Repository<User>;
  private postRepo: Repository<RealEstatePost>;
  developerRepo: Repository<Developer>;
  private notificationService: NotificationService;
  constructor(dataSource: DataSource, notificationService: NotificationService) {
    this.userRepo = dataSource.getRepository(User);
    this.postRepo = dataSource.getRepository(RealEstatePost);
    this.developerRepo = dataSource.getRepository(Developer);
    this.notificationService = notificationService;
  }

  async approvePost(id: string) {
    const post = await this.postRepo
      .createQueryBuilder()
      .setParameters({ current_user_id: null })
      .where('id = :id', { id })
      .andWhere('is_active = true')
      .getOne();
    await this.postRepo
      .createQueryBuilder()
      .update()
      .set({ status: PostStatus.approved, info_message: null })
      .where('id = :id', { id })
      .execute();

    await this.notificationService.createNotification({
      type: NotificationType.post_approved,
      headings: {
        vi: post!.title,
        en: post!.title,
      },
      content: {
        vi: 'Bài đăng của bạn đã được duyệt thành công',
        en: 'Your post has been approved',
      },
      data: {
        post_id: id,
      },
      big_picture: post!.images[0],
      include_external_user_ids: [post!.user_id],
    });

    return id;
  }

  async rejectPost(id: string, reason: string) {
    const post = await this.postRepo
      .createQueryBuilder()
      .where('id = :id', { id })
      .andWhere('is_active = true')
      .setParameters({ current_user_id: null })
      .getOne();

    await this.postRepo
      .createQueryBuilder()
      .update()
      .set({ status: PostStatus.rejected, info_message: reason })
      .where('id = :id', { id })
      .execute();

    await this.notificationService.createNotification({
      type: NotificationType.post_rejected,
      headings: {
        vi: post!.title,
        en: post!.title,
      },
      content: {
        vi: 'Bài đăng của bạn đã bị từ chối vì ' + reason,
        en: 'Your post has been rejected because ' + reason,
      },
      data: {
        post_id: id,
      },
      big_picture: post!.images[0],
      include_external_user_ids: [post!.user_id],
    });
    return id;
  }

  async deletePost(id: string) {
    const post = await this.postRepo
      .createQueryBuilder()
      .where('id = :id', { id })
      .andWhere('is_active = true')
      .setParameters({ current_user_id: null })
      .getOne();

    await this.postRepo.createQueryBuilder().update().set({ is_active: false }).where('id = :id', { id }).execute();

    await this.notificationService.createNotification({
      type: NotificationType.post_deleted,
      headings: {
        vi: post!.title,
        en: post!.title,
      },
      content: {
        vi: 'Bài đăng ' + post!.title + ' của bạn đã bị xóa bởi quản trị viên',
        en: 'Your post ' + post!.title + ' has been deleted by admin',
      },
      data: {
        post_id: id,
      },
      big_picture: post!.images[0],
      include_external_user_ids: [post!.user_id],
    });

    return id;
  }
}

export default AdminService;
