import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/service/auth/guard/jwt-guard';
import { UserIsUser } from 'src/auth/service/auth/guard/user-is-user.guard';
import { UserIsAuthorGuard } from 'src/blog/guards/user-is-author.guard';
import { BlogEntry } from 'src/blog/model/blog-entry.interface';
import { BlogService } from 'src/blog/service/blog/blog.service';

@Controller('blog-entries')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() blogEntry: BlogEntry, @Request() req): Observable<BlogEntry> {
    const user = req.user;
    return this.blogService.create(user, blogEntry);
  }

  // @Get()
  // findBlogEntries(@Query('userId') userId: number): Observable<BlogEntry[]> {
  //   if (userId === null) {
  //     return this.blogService.findAll();
  //   }
  //   return this.blogService.findByUser(userId);
  // }

  @Get('')
  index(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;

    return this.blogService.paginateBlogEntriesAll({
      limit,
      page,
      route: 'http://localhost:3000/blog-entries'
    });
  }

  @Get('user/:user')
  indexByUser(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Param('user') userId: number
  ) {
    limit = limit > 100 ? 100 : limit;

    return this.blogService.paginateBlogByUser({
      limit,
      page,
      route: 'http://localhost:3000/blog-entries'
    }, userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Observable<BlogEntry> {
    return this.blogService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Put(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() blogEntry: BlogEntry,
  ): Observable<BlogEntry> {
    return this.blogService.updateOne(id, blogEntry);
  }

  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return this.blogService.deleteOne(id);
  }
}
