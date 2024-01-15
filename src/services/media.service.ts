import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import ConcurrentQueue from '~/utils/queue';
import { v4 as uuidv4 } from 'uuid';
import AppConfig from '../constants/configs';
import { Service } from 'typedi';

interface UpLoadFileOptions {
  publicId?: string;
  onFileUploaded?: (url: string) => void;
}
@Service()
class MediaServices {
  private queue: ConcurrentQueue;
  constructor() {
    cloudinary.config({
      // account_id: process.env.CLOUDINARY_ACCOUNT_ID,
      cloud_name: AppConfig.CLOUDINARY_CLOUD_NAME as string,
      api_key: AppConfig.CLOUDINARY_API_KEY as string,
      api_secret: AppConfig.CLOUDINARY_API_SECRET as string,
      secure: true,
    });
    this.queue = new ConcurrentQueue(10);
  }

  public upload(file: Express.Multer.File, folder: string, options: UpLoadFileOptions): string {
    const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'video';
    options.publicId = options.publicId || uuidv4();
    const uploadOptions: UploadApiOptions = {
      public_id: options.publicId,
      folder,
      allowed_formats: ['jpg', 'jpeg', 'mp4', 'png'],
      resource_type: resourceType,
    };
    const url = cloudinary.url(folder + '/' + options.publicId, {
      resource_type: resourceType,
      type: 'upload',
    });
    this.queue.add({
      execute: async () => {
        cloudinary.uploader
          .upload_stream(uploadOptions, (err, res) => {
            if (err) {
              console.error(err);
            }
            if (options.onFileUploaded) {
              options.onFileUploaded(url);
            }
            console.log(res);
          })
          .end(file.buffer);
      },
      onError: (err) => {
        console.log('Error uploading file to Cloudinary');
        console.error(err);
      },
    });
    return url;
  }
}

export default MediaServices;
