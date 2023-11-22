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
const cloudinary_1 = require("cloudinary");
const queue_1 = __importDefault(require("../utils/queue"));
const uuid_1 = require("uuid");
const configs_1 = __importDefault(require("../constants/configs"));
const typedi_1 = require("typedi");
let MediaServices = class MediaServices {
    queue;
    constructor() {
        cloudinary_1.v2.config({
            // account_id: process.env.CLOUDINARY_ACCOUNT_ID,
            cloud_name: configs_1.default.CLOUDINARY_CLOUD_NAME,
            api_key: configs_1.default.CLOUDINARY_API_KEY,
            api_secret: configs_1.default.CLOUDINARY_API_SECRET,
            secure: true,
        });
        this.queue = new queue_1.default(1);
    }
    upload(file, folder, publicId = (0, uuid_1.v4)()) {
        const resourceType = file.mimetype.startsWith('image/') ? 'image' : 'video';
        const options = {
            public_id: publicId,
            folder,
            allowed_formats: ['jpg', 'jpeg', 'mp4'],
            resource_type: resourceType,
        };
        this.queue.add({
            execute: async () => {
                await cloudinary_1.v2.uploader
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
        const url = cloudinary_1.v2.url(folder + '/' + publicId, {
            resource_type: resourceType,
            type: 'upload',
        });
        return url;
    }
};
MediaServices = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], MediaServices);
exports.default = MediaServices;
