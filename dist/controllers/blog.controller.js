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
const Error_1 = require("../models/Error");
const build_query_1 = require("../utils/build_query");
const wrapRequestHandler_1 = require("../utils/wrapRequestHandler");
const blog_service_1 = __importDefault(require("../services/blog.service"));
const typedi_1 = require("typedi");
let BlogController = class BlogController {
    blogService;
    constructor(blogService) {
        this.blogService = blogService;
    }
    createBlog = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const blog = {};
        blog.title = req.body.title;
        blog.content = req.body.content;
        blog.author = req.body.author;
        blog.thumbnail = req.body.thumbnail;
        blog.short_description = req.body.short_description;
        if (!blog.title || !blog.content || !blog.author || !blog.thumbnail || !blog.short_description) {
            throw new Error_1.AppError('Missing fields', 400);
        }
        await this.blogService.create(blog);
        const appResponse = {
            status: 'success',
            code: 200,
            message: 'Create blog successfully',
        };
        res.json(appResponse);
    });
    getAllBlog = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const query = (0, build_query_1.buildBaseQuery)(req.query);
        const verifyResult = req.verifyResult;
        const blogs = await this.blogService.getAllWithFavoriteByQuery(query, req.user ? req.user.id : null);
        const appResponse = {
            status: 'success',
            code: 200,
            message: 'Get all blogs successfully',
            num_of_pages: blogs.num_of_pages,
            result: blogs.data,
        };
        res.json(appResponse);
    });
    getBlogById = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const blog = await this.blogService.getById(id);
        const appResponse = {
            status: 'success',
            code: 200,
            message: 'Get blog by id successfully',
            result: blog,
        };
        res.json(appResponse);
    });
    //Update blog
    updateBlog = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const blog = await this.blogService.update(id, req.body);
        const appResponse = {
            status: 'success',
            code: 200,
            message: 'Update blog successfully',
            result: blog,
        };
        res.json(appResponse);
    });
    //Delete blog
    deleteBlog = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        await this.blogService.markDeleted(id);
        const appResponse = {
            status: 'success',
            code: 200,
            message: 'Delete blog successfully',
        };
        res.json(appResponse);
    });
    generateBlogHTML(blog) {
        // Format the date
        const formattedDate = blog.created_at.toDateString();
        // Generate the HTML string with added CSS styles
        const htmlWithCSS = `
          <style>
            .blog {
              display: flex;
              border: 1px solid #ddd;
              margin: 10px;
              padding: 10px;
              border-radius: 8px;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            }
      
            .blog-thumbnail {
              max-width: 150px;
              margin-right: 10px;
              border-radius: 4px;
            }
      
            .blog-content {
              flex-grow: 1;
            }
      
            .blog-title {
              color: #333;
            }
      
            .blog-date {
              color: #888;
              font-size: 0.8em;
            }
      
            .blog-description {
              margin-top: 5px;
              color: #555;
            }
      
            .blog-author {
              margin-top: 5px;
              color: #777;
            }
      
            .blog-content {
              margin-top: 10px;
            }
          </style>
          <div class="blog">
            <div class="blog-content">
            <h1>Thumbnail</h1>
            <img class="blog-thumbnail" src="${blog.thumbnail}" alt="${blog.title}" />
              <h2 class="blog-title">${blog.title}</h2>
              <p class="blog-date">${formattedDate}</p>
              <p class="blog-description">${blog.short_description}</p>
              <p class="blog-author">Author: ${blog.author}</p>
              <div class="blog-content">${blog.content}</div>
            </div>
          </div>
        `;
        return htmlWithCSS;
    }
    viewBlog = (0, wrapRequestHandler_1.wrapRequestHandler)(async (req, res) => {
        const { id } = req.params;
        const blog = (await this.blogService.getById(id));
        if (!blog) {
            const html = '<h1>Not found</h1>';
            return res.send(html);
        }
        const html = this.generateBlogHTML(blog);
        res.send(html);
    });
};
BlogController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [blog_service_1.default])
], BlogController);
exports.default = BlogController;
