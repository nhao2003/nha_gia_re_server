"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const express_validator_1 = require("express-validator");
const enum_1 = require("../constants/enum");
const Features_1 = require("../domain/typing/Features");
const post_service_1 = __importDefault(require("../services/post.service"));
const validation_1 = require("../utils/validation");
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const params_validation_1 = require("../validations/params_validation");
const Error_1 = require("../models/Error");
const typedi_1 = require("typedi");
let PostValidation = class PostValidation {
    postServices;
    constructor(postServices) {
        this.postServices = postServices;
    }
    createPostValidation = [
        (0, validation_1.validate)((0, express_validator_1.checkSchema)({
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
                    options: (value) => {
                        return Object.values(enum_1.PropertyTypes).includes(value);
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
            address: params_validation_1.ParamsValidation.address,
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
                    options: (value) => {
                        if (!value)
                            return true;
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
                    options: (value) => {
                        try {
                            //Is array of string
                            if (!Array.isArray(value))
                                return false;
                            for (const image of value) {
                                if (typeof image !== 'string')
                                    return false;
                            }
                            return true;
                        }
                        catch (error) {
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
                    options: (value) => {
                        if (!value)
                            return true;
                        try {
                            if (!Array.isArray(value))
                                return false;
                            for (const video of value) {
                                if (typeof video !== 'string')
                                    return false;
                            }
                            return true;
                        }
                        catch (error) {
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
        })),
        (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
            const data = {
                type_id: req.body.type_id,
                ...req.body.features,
            };
            try {
                Features_1.PropertyFeatures.fromJson(data);
                next();
            }
            catch (error) {
                next(error);
            }
        }),
    ];
    checkPostExist = [
        (0, validation_1.validate)((0, express_validator_1.checkSchema)({
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
        })),
        (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res, next) => {
            const post = await this.postServices.checkPostExist(req.params.id);
            console.log(post);
            if (post === null || post === undefined)
                next(new Error_1.AppError('Post is not exist', 404));
            if (req.user.id !== post.user_id)
                next(new Error_1.AppError('You are not authorized to perform this action', 403));
            req.post = post;
            next();
        }),
    ];
};
exports.PostValidation = PostValidation;
exports.PostValidation = PostValidation = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [post_service_1.default])
], PostValidation);
