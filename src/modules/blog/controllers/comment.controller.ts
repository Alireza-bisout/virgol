import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateBlogDto } from '../dto/blog.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consume.enums';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { BlogCommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/comment.dto';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('blog-comment')
@ApiTags("Comment")
@AuthDecorator()
export class BlogCommmentController {
    constructor(private readonly blogCommentService: BlogCommentService) { }



    @Post("/")
    @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    create(@Body() commentDto: CreateCommentDto) {
        return this.blogCommentService.create(commentDto)
    }


    @Get("/")
    @Pagination()
    find(@Query() paginationDto: PaginationDto) {
        return this.blogCommentService.find(paginationDto)
    }

    @Put("/accept/:id")
    accept(@Param("id", ParseIntPipe) id: number) {
        return this.blogCommentService.accept(id)
    }

    @Put("/reject/:id")
    reject(@Param("id", ParseIntPipe) id: number) {
        return this.blogCommentService.reject(id)
    }


}
