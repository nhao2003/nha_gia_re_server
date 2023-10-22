"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const post_services_1 = __importDefault(require("../services/post.services"));
const Features_1 = require("../domain/typing/Features");
const address_1 = __importDefault(require("../domain/typing/address"));
class PostController {
    generaRandomPic(count) {
        const pics = [];
        for (let i = 0; i < count; i++) {
            pics.push(`https://picsum.photos/seed/${Math.random() * 1001}/200/300`);
        }
        return pics;
    }
    createPost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        // let data = filterBody(req.body, [
        //   'type_id',
        //   'unit_id',
        //   'title',
        //   'description',
        //   'price',
        //   'desposit',
        //   'area',
        //   'is_lease',
        //   'is_pro_seller',
        //   'images',
        //   'videos',
        // ]);
        // data = {
        //   ...data,
        //   address: Address.fromJSON(req.body.address),
        //   features: PropertyFeatures.fromJson({
        //     type_id: req.body.type_id,
        //     ...req.body.features,
        //   }),
        //   user_id: req.user.id,
        // };
        const data = {
            type_id: req.body.type_id,
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            desposit: req.body.desposit,
            area: req.body.area,
            is_lease: req.body.is_lease,
            is_pro_seller: req.body.is_pro_seller,
            images: req.body.images,
            videos: req.body.videos.length > 0 ? req.body.videos : null,
            address: address_1.default.fromJSON(req.body.address),
            features: Features_1.PropertyFeatures.fromJson({
                type_id: req.body.type_id,
                ...req.body.features,
            }),
            user_id: req.user.id,
        };
        const post = await post_services_1.default.createPost(data);
        res.status(200).json(post);
    });
    getAllPost = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const post = await post_services_1.default.getPosts(req.query.page);
        res.status(200).json(post);
    });
    getPostById = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const post = await post_services_1.default.getPostById(req.params.id);
        res.status(200).json(post);
    });
}
exports.default = new PostController();
