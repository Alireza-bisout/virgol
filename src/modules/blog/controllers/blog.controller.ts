import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consume.enums';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { FillterBlog } from 'src/common/decorators/fillter.decorator';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';

@Controller('blog')
@ApiTags("Blog")
@AuthDecorator()
export class BlogController {
  constructor(private readonly blogService: BlogService) { }



  @Post("/")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() blogDto: CreateBlogDto) {
    return this.blogService.create(blogDto)
  }

  @Get("/my")
  myBlogs() {
    return this.blogService.myBlog()
  }

  @Get("/")
  @SkipAuth()
  @Pagination()
  @FillterBlog()
  find(@Query() paginationDto: PaginationDto, @Query() filterDto: FilterBlogDto) {
    return this.blogService.blogList(paginationDto, filterDto)
  }

  @Get("/by-slug/:slug")
  @SkipAuth()
  @Pagination()
  findOneBySlug(@Param('slug') slug: string, @Query() paginationDto: PaginationDto) {
    return this.blogService.findOneBySlug(slug, paginationDto)
  }


  @Get("/like/:id")
  likeToggle(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.likeToggle(id)
  }

  @Get("/bookamrk/:id")
  bookamrkToggle(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.bookamrkToggle(id)
  }

  @Delete("/:id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.delete(id)
  }

  @Put("/:id")
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(@Param("id", ParseIntPipe) id: number, @Body() blogDto: UpdateBlogDto) {
    return this.blogService.uptade(id, blogDto)
  }



}
