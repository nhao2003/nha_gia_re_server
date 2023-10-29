import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import ConcurrentQueue from '~/utils/queue';
import { v4 as uuidv4 } from 'uuid';
class MediaServices {
  private static instance: MediaServices;
  public static getInstance(): MediaServices {
    if (!MediaServices.instance) {
      MediaServices.instance = new MediaServices();
    }
    return MediaServices.instance;
  }
  private queue: ConcurrentQueue;
  constructor() {
    cloudinary.config({
      // account_id: process.env.CLOUDINARY_ACCOUNT_ID,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    this.queue = new ConcurrentQueue(1);
  }

  public upload(file: Express.Multer.File, folder: string, publicId: string = uuidv4()) {
    const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'video';
    const options: UploadApiOptions = {
      public_id: publicId,
      folder,
      allowed_formats: ['jpg', 'jpeg', 'mp4'],
      resource_type: resourceType,
    };
    this.queue.add({
      execute: async () => {
        await cloudinary.uploader
          .upload_stream(options, (err, res) => {
            if (err) {
              console.error(err);
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
    const url = cloudinary.url(folder + '/' + publicId, {
      resource_type: resourceType,
      type: 'upload',
    });
    return url;
  }
}

export default MediaServices.getInstance();
