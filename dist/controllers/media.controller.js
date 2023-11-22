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
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const multer_1 = __importDefault(require("multer"));
const media_service_1 = __importDefault(require("../services/media.service"));
const typedi_1 = require("typedi");
let MediaController = class MediaController {
    multer = multer_1.default.memoryStorage();
    uploadMiddleware = (0, multer_1.default)({ storage: this.multer });
    mediaServices;
    constructor(mediaServices) {
        this.mediaServices = mediaServices;
    }
    upload = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        try {
            const multiFileUploadMiddleware = this.uploadMiddleware.array('files', 12); // 'files' is the field name
            multiFileUploadMiddleware(req, res, async (err) => {
                if (err) {
                    const appRes = {
                        status: 'error',
                        message: 'Error uploading file(s).',
                        code: 500,
                        result: null,
                    };
                    return res.status(500).json(appRes);
                }
                if (!req.files || req.files.length === 0) {
                    const appRes = {
                        status: 'error',
                        message: 'No files provided.',
                        code: 400,
                        result: null,
                    };
                    return res.status(400).json(appRes);
                }
                const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'video/mp4'];
                const uploadedFiles = req.files;
                const fileUrls = [];
                for (const file of uploadedFiles) {
                    if (!allowedMimeTypes.includes(file.mimetype)) {
                        return res.status(400).json({
                            code: 400,
                            status: 'fail',
                            message: 'Invalid file type.',
                        });
                    }
                    // File size limit is 50MB
                    if (file.size > 50 * 1024 * 1024) {
                        return res.status(400).json({
                            code: 400,
                            status: 'fail',
                            message: 'File size limit exceeded.',
                        });
                    }
                    const isImage = file.mimetype.startsWith('image/');
                    const subdirectory = isImage ? 'images' : 'videos';
                    const url = this.mediaServices.upload(file, subdirectory);
                    fileUrls.push(url);
                }
                const appRes = {
                    status: 'success',
                    message: 'File(s) uploaded successfully.',
                    code: 200,
                    result: fileUrls,
                };
                return res.json(appRes);
            });
        }
        catch (error) {
            console.log('error', error);
            const appRes = {
                status: 'error',
                message: 'Error uploading file(s).',
                code: 500,
                result: null,
            };
            return res.status(500).json(appRes);
        }
    });
};
MediaController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [media_service_1.default])
], MediaController);
exports.default = MediaController;
