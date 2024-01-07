import { checkSchema } from 'express-validator';
import { PropertyTypes } from '~/constants/enum';
import { PropertyFeatures } from '~/domain/typing/Features';
import Address from '~/domain/typing/address';
import PostServices from '~/services/post.service';
import { validate } from '~/utils/validation';
import { wrapRequestHandler } from '~/utils/wrapRequestHandler';
import { ParamsValidation } from '~/validations/params_validation';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '~/models/Error';
import { Service } from 'typedi';

@Service()
class PostValidation {
  private postServices: PostServices;

  constructor(postServices: PostServices) {
    this.postServices = postServices;
  }
  public createPostValidation = [
    validate(
      checkSchema({
        type_id: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Type id is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Type id is not valid',
          },
          custom: {
            options: (value: any) => {
              return Object.values(PropertyTypes).includes(value);
            },
            errorMessage: 'Type id is not valid.',
          },
        },
        title: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Title is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Title is not valid',
          },
          isLength: {
            errorMessage: 'Title must be at least 1 characters and less than 255 characters',
            options: { min: 1, max: 255 },
          },
        },
        description: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Description is required',
          },
          trim: true,
          isString: {
            errorMessage: 'Description is not valid',
          },
          isLength: {
            errorMessage: 'Description must be at least 1 characters and less than 1500 characters',
            options: { min: 1, max: 1500 },
          },
        },
        area: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Area is required',
          },
          trim: true,
          isFloat: {
            options: { min: 1, max: 1000000000 },
            errorMessage: 'Area is not valid',
          },
        },
        address: ParamsValidation.address,
        price: {
          in: ['body'],
          notEmpty: {
            errorMessage: 'Price is required',
          },
          trim: true,
          isInt: {
            options: { min: 1, max: 1000000000 },
            errorMessage: 'Price is not valid',
          },
        },
        deposit: {
          in: ['body'],
          custom: {
            options: (value: any) => {
              if (!value) return true;
              const isNumber = typeof value === 'number';
              const isInterger = Number.isInteger(value);
              const isInRange = value >= 0 && value <= 1000000000;
              return isNumber && isInterger && isInRange;
            },
            errorMessage: 'Deposit is not valid.',
          },
        },
        is_lease: {
          in: ['body'],
          trim: true,
          notEmpty: {
            errorMessage: 'Is lease is required',
          },
          isBoolean: {
            errorMessage: 'Is lease is not valid',
          },
        },
        images: {
          in: ['body'],
          trim: true,
          isArray: {
            errorMessage: 'Images is not valid',
          },
          custom: {
            options: (value: any) => {
              try {
                //Is array of string
                if (!Array.isArray(value)) return false;
                for (const image of value) {
                  if (typeof image !== 'string') return false;
                }
                return true;
              } catch (error) {
                return false;
              }
            },
            errorMessage: 'Images is not valid.',
          },
        },
        videos: {
          in: ['body'],
          trim: true,
          custom: {
            options: (value: any) => {
              if (!value) return true;
              try {
                if (!Array.isArray(value)) return false;
                for (const video of value) {
                  if (typeof video !== 'string') return false;
                }
                return true;
              } catch (error) {
                return false;
              }
            },
            errorMessage: 'Videos is not valid.',
          },
        },

        is_pro_seller: {
          in: ['body'],
          trim: true,
          notEmpty: {
            errorMessage: 'Is pro seller is required',
          },
          isBoolean: {
            errorMessage: 'Is pro seller is not valid',
          },
        },
        unit_id: {
          in: ['body'],
          trim: true,
          isString: {
            errorMessage: 'Unit id is not valid',
          },
        },
      }),
    ),
    wrapRequestHandler(async (req, res, next) => {
      const data = {
        type_id: req.body.type_id,
        ...req.body.features,
      };
      try {
        PropertyFeatures.fromJson(data);
        next();
      } catch (error) {
        next(error);
      }
    }),
  ];

  public checkPostExist = [
    validate(
      checkSchema({
        id: {
          in: ['params'],
          notEmpty: {
            errorMessage: 'Post id is required',
          },
          trim: true,
          isUUID: {
            errorMessage: 'Post id is not valid',
          },
        },
      }),
    ),
    wrapRequestHandler(async (req: Request, res: Response, next: NextFunction) => {
      const post = await this.postServices.checkPostExist(req.params.id);
      if (post === null || post === undefined) return next(AppError.notFound());
      if (req.user!.id !== post!.user_id) return next(AppError.forbiden());
      req.post = post;
      next();
    }),
  ];
}
export { PostValidation };
