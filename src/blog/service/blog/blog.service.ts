import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable, of, switchMap, tap } from 'rxjs';
import { BlogEntryEntity } from 'src/blog/model/blog-entry.entity';
import { BlogEntry } from 'src/blog/model/blog-entry.interface';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntryEntity)
    private readonly blogRespository: Repository<BlogEntryEntity>,
    private userService: UserService,
  ) {}

  create(user: User, blogEntry: BlogEntry): Observable<BlogEntry> {
    blogEntry.author = user;
    return this.generateSlug(blogEntry.title).pipe(
      switchMap((slug: string) => {
        blogEntry.slug = slug;
        return from(this.blogRespository.save(blogEntry));
      }),
    );
  }

  findAll(): Observable<BlogEntry[]> {
    return from(this.blogRespository.find({ relations: ['author'] }));
  }

  findByUser(userId: number): Observable<BlogEntry[]> {
    return from(
      this.blogRespository.find({
        where: {
          author: {
            id: userId,
          },
        },
        relations: ['author'],
      }),
    );
  }

  findOne(id: number): Observable<BlogEntry> {
    return from(
      this.blogRespository.findOne({ where: { id }, relations: ['author'] }),
    );
  }

  updateOne(id: number, blogEntry: BlogEntry): Observable<any> {
    return from(this.blogRespository.update({ id }, { ...blogEntry })).pipe(
      switchMap(() => this.findOne(id)),
    );
  }

  generateSlug(title: string): Observable<string> {
    return of(title.toLowerCase().replace(/ /g, '-'));
  }

  deleteOne(id: number): Observable<any> {
    return from(this.blogRespository.delete(id));
  }
}
