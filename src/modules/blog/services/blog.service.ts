import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { createSlug, randomId } from 'src/common/utils/functions.util';
import { BlogStatus } from '../enum/status.enum';
import { REQUEST } from '@nestjs/core';
import { BadRequestMessage, NotFoundtMessage, PublicMessage } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.util';
import { isArray } from 'class-validator';
import { CategoryService } from '../../category/category.service';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import { BlolgLikesEntity } from '../entities/like.entity';
import { BlolgBookmarkEntity } from '../entities/bookmark.entity';
import { CreateCommentDto } from '../dto/comment.dto';
import { BlogCommentService } from './comment.service';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {

    constructor(
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogCategoryEntity) private blogCategoryRepository: Repository<BlogCategoryEntity>,
        @InjectRepository(BlolgLikesEntity) private blogLikeRepository: Repository<BlolgLikesEntity>,
        @InjectRepository(BlolgBookmarkEntity) private blogBookmarkRepository: Repository<BlolgBookmarkEntity>,
        @Inject(REQUEST) private request,
        private categoryService: CategoryService,
        private blogCommentService: BlogCommentService
    ) { }

    async create(blogDto: CreateBlogDto) {
        const user: any = this.request.user
        let { title, slug, content, description, image, time_for_study, categories } = blogDto

        if (!isArray(categories) && typeof categories === "string") {
            categories = categories.split(",")
        } else if (!isArray(categories)) {
            throw new BadRequestException(BadRequestMessage.InValidCategories)
        }

        let slugData = slug ?? title
        slug = createSlug(slugData)
        const isExist = await this.checkBlogBySlug(slug)
        if (isExist) {
            slug += `-${randomId()}`
        }

        let blog = this.blogRepository.create({
            title,
            slug,
            content,
            description,
            image,
            time_for_study,
            status: BlogStatus.Draft,
            authorId: user.id,

        })

        blog = await this.blogRepository.save(blog)

        for (const categoryTitle of categories) {
            let category = await this.categoryService.findOneByTitle(categoryTitle)
            if (!category) {
                category = await this.categoryService.insertByTitle(categoryTitle)
            }
            await this.blogCategoryRepository.insert({
                blogId: blog.id,
                categoryId: category.id
            })
        }

        return {
            message: PublicMessage.Created
        }
    }

    async checkBlogBySlug(slug: string) {
        const blog = await this.blogRepository.findOneBy({ slug })
        return blog
    }

    async myBlog() {
        const { id } = this.request.user

        return this.blogRepository.find({
            where: {
                authorId: id
            },
            order: {
                id: "DESC"
            }
        })
    }

    async blogList(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
        const { limit, page, skip } = paginationSolver(paginationDto)
        let { category, search } = filterDto
        let where = ""

        if (category) {
            category = category.toLowerCase()
            if (where.length > 0) where += ' AND '
            where += 'category.title = LOWER(:category)'
        }

        if (search) {
            if (where.length > 0) where += ' AND '
            search = `%${search}%`
            where += 'CONCAT(blog.title, blog.description, blog.content) ILIKE :search'
        }

        const [blogs, count] = await this.blogRepository.createQueryBuilder(EntityNames.Blog)
            .leftJoin("blog.categories", "categories")
            .leftJoin("categories.category", "category")
            .leftJoin("blog.author", "author")
            .leftJoin("author.profile", "profile",)
            .addSelect(['categories.id', 'category.title', 'author.username', 'author.id', 'profile.nike_name'])
            .where(where, { category, search })
            .loadRelationCountAndMap("blog.likes", "blog.likes")
            .loadRelationCountAndMap("blog.bookmarks ", "blog.bookmarks")
            .loadRelationCountAndMap("blog.comments", "blog.comments", "comments", qb =>
                qb.where("comments.accepted = :accepted", { accepted: true })
            )
            .orderBy("blog.id", 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount()

        return {
            pagination: paginationGenerator(count, page, limit),
            blogs
        }
    }

    async checkExistBlogById(id: number) {
        const blog = await this.blogRepository.findOneBy({ id })
        if (!blog) throw new NotFoundException(NotFoundtMessage.NotFoundPost)
        return blog
    }

    async delete(id: number) {
        await this.checkExistBlogById(id)
        await this.blogRepository.delete({ id })
        return {
            message: PublicMessage.Deleted
        }
    }

    async uptade(id: number, blogDto: UpdateBlogDto) {
        const user: any = this.request.user
        let { title, slug, content, description, image, time_for_study, categories } = blogDto
        let blog = await this.checkExistBlogById(id)

        if (!isArray(categories) && typeof categories === "string") {
            categories = categories.split(",")
        } else if (!isArray(categories)) {
            throw new BadRequestException(BadRequestMessage.InValidCategories)
        }

        let slugData: any = null

        if (title) {
            slugData = title
            blog.title = title
        }
        if (slug) slugData = title

        if (slugData) {
            slug = createSlug(slugData)
            const isExist = await this.checkBlogBySlug(slug)
            if (isExist && isExist.id !== id) {
                slug += `-${randomId()}`
            }
            blog.slug = slug
        }

        if (description) blog.description = description

        if (image) blog.image = image

        if (time_for_study) blog.time_for_study = time_for_study

        await this.blogRepository.save(blog)

        if (categories && isArray(categories) && categories.length > 0) {
            await this.blogCategoryRepository.delete({ blogId: blog.id })
        }

        for (const categoryTitle of categories) {
            let category = await this.categoryService.findOneByTitle(categoryTitle)
            if (!category) {
                category = await this.categoryService.insertByTitle(categoryTitle)
            }
            await this.blogCategoryRepository.insert({
                blogId: blog.id,
                categoryId: category.id
            })

        }

        return {
            message: PublicMessage.Updated
        }
    }

    async likeToggle(blogId: number) {

        const { id: userId } = this.request.user
        const blog = await this.checkExistBlogById(userId)
        const isLiked = await this.blogLikeRepository.findOneBy({ userId, blogId })
        let message = PublicMessage.Like

        if (isLiked) {
            await this.blogLikeRepository.delete({ id: isLiked.id })
            message = PublicMessage.DisLike
        } else {
            await this.blogLikeRepository.insert({ userId, blogId })
        }
        return { message }

    }

    async bookamrkToggle(blogId: number) {
        const { id: userId } = this.request.user
        const blog = await this.checkExistBlogById(userId)
        const isBookmarked = await this.blogBookmarkRepository.findOneBy({ userId, blogId })
        let message = PublicMessage.Bookmark

        if (isBookmarked) {
            await this.blogBookmarkRepository.delete({ id: isBookmarked.id })
            message = PublicMessage.UnBookmark
        } else {
            await this.blogBookmarkRepository.insert({ userId, blogId })
        }
        return { message }

    }

    async findOneBySlug(slug: string, paginationDto: PaginationDto) {
        const userId = this.request?.user?.id
        const blog = await this.blogRepository.createQueryBuilder(EntityNames.Blog)
            .leftJoin("blog.categories", "categories")
            .leftJoin("categories.category", "category")
            .leftJoin("blog.author", "author")
            .leftJoin("author.profile", "profile",)
            .addSelect([
                'categories.id',
                'category.title',
                'author.username',
                'author.id',
                'profile.nike_name'
            ])
            .where({ slug })
            .loadRelationCountAndMap("blog.likes", "blog.likes")
            .loadRelationCountAndMap("blog.bookmarks ", "blog.bookmarks")
            .getOne()

        if (!blog) throw new NotFoundException(NotFoundtMessage.NotFoundPost)
        const commentData = await this.blogCommentService.findCommentsOfBlog(blog.id, paginationDto)

        let isLiked = false
        let isBookmarked = false

        if (userId && isNaN(userId) && userId > 0) {
            isLiked = !!(await this.blogLikeRepository.findOneBy({ userId, blogId: blog.id }))
            isBookmarked = !!(await this.blogBookmarkRepository.findOneBy({ userId, blogId: blog.id }))

        }


        return {
            blog,
            isLiked,
            isBookmarked,
            commentData
        }
    }

}
