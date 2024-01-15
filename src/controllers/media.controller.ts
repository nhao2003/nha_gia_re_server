import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { Request, Response } from 'express';
import multer from 'multer';
import MediaServices from '~/services/media.service';
import AppResponse from '~/models/AppRespone';
import { Service } from 'typedi';

@Service()
class MediaController {
  private multer = multer.memoryStorage();
  private uploadMiddleware = multer({ storage: this.multer });
  private mediaServices: MediaServices;

  constructor(mediaServices: MediaServices) {
    this.mediaServices = mediaServices;
  }

  public upload = wrapRequestHandler(async (req: Request, res: Response) => {
    try {
      const isAsync = req.query.async === 'true';

      const multiFileUploadMiddleware = this.uploadMiddleware.array('files', 12); // 'files' is the field name
      multiFileUploadMiddleware(req, res, async (err: any) => {
        if (err) {
          const appRes: AppResponse = {
            status: 'error',
            message: 'Error uploading file(s).',
            code: 500,
            result: null,
          };
          return res.status(500).json(appRes);
        }

        if (!req.files || req.files.length === 0) {
          const appRes: AppResponse = {
            status: 'error',
            message: 'No files provided.',
            code: 400,
            result: null,
          };
          return res.status(400).json(appRes);
        }
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'video/mp4', 'image/png'];
        const uploadedFiles = req.files as Express.Multer.File[];

        const fileUrls: string[] = [];
        let fileCount = 0;
        for (const file of uploadedFiles) {
          if (!allowedMimeTypes.includes(file.mimetype)) {
            return res.status(400).json({
              code: 400,
              status: 'fail',
              message: 'Invalid file type.',
            });
          }
          if (file.size > 50 * 1024 * 1024) {
            return res.status(400).json({
              code: 400,
              status: 'fail',
              message: 'File size limit exceeded.',
            });
          }
          const isImage = file.mimetype.startsWith('image/');
          const subdirectory = isImage ? 'images' : 'videos';

          const url = this.mediaServices.upload(file, subdirectory, {
            onFileUploaded: (url: string) => {
              fileCount++;
              if (isAsync) {
                fileUrls.push(url);
              }
              if (isAsync && fileCount === uploadedFiles.length) {
                const appRes: AppResponse = {
                  status: 'success',
                  message: 'File(s) uploaded successfully.',
                  code: 200,
                  result: fileUrls,
                };
                return res.json(appRes);
              }
            },
          });
          // fileUrls.push(url);
          if (!isAsync) {
            fileUrls.push(url);
          }
        }
        if (!isAsync) {
          const appRes: AppResponse = {
            status: 'success',
            message: 'File(s) uploaded successfully.',
            code: 200,
            result: fileUrls,
          };
          return res.json(appRes);
        }
      });
    } catch (error) {
      console.log('error', error);
      const appRes: AppResponse = {
        status: 'error',
        message: 'Error uploading file(s).',
        code: 500,
        result: null,
      };
      return res.status(500).json(appRes);
    }
  });
}

export default MediaController;
