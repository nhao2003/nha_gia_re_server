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
      .where('id = :id', { id })
      .andWhere('is_active = true')
      .setParameters({ current_user_id: null })
      .getOne();
    post!.status = PostStatus.approved;
    post!.info_message = null;
    await this.postRepo.save(post!);

    await this.notificationService.createNotification({
      type: NotificationType.info,
      headings: {
        vi: 'Bài đăng được duyệt',
        en: 'Post approved',
      },
      content: {
        vi: 'Bài đăng ' + post!.title + ' của bạn đã được duyệt',
        en: 'Your post ' + post!.title + ' has been approved',
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
    post!.status = PostStatus.rejected;
    post!.info_message = reason;
    await this.postRepo.save(post!);

    await this.notificationService.createNotification({
      type: NotificationType.info,
      headings: {
        vi: 'Bài đăng bị từ chối',
        en: 'Post rejected',
      },
      content: {
        vi: 'Bài đăng ' + post!.title + ' của bạn đã bị từ chối vì ' + reason,
        en: 'Your post ' + post!.title + ' has been rejected because ' + reason,
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
    post!.is_active = false;
    await this.postRepo.save(post!);

    await this.notificationService.createNotification({
      type: NotificationType.info,
      headings: {
        vi: 'Bài đăng bị xóa bởi quản trị viên',
        en: 'Post deleted by admin',
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
