import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { Pagination } from 'nestjs-typeorm-paginate';
import { catchError, map, Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/service/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/service/auth/guard/jwt-guard';
import { RolesGuard } from 'src/auth/service/auth/guard/roles.guard';
import { User, UserRole } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Observable<User> {
    return this.userService.findOne(id);
  }

  @Get()
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('username') username?: string,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    if (username === null || username === undefined || username === '') {
      return this.userService.paginate({
        page,
        limit,
        route: 'http://localhost:300/users',
      });
    } else {
      return this.userService.paginateFilterByUsername(
        {
          page,
          limit,
          route: 'http://localhost:300/users',
        },
        username,
      );
    }
  }

  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number): Observable<any> {
    return this.userService.delete(id);
  }

  @Put(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Observable<any> {
    return this.userService.updateOne(id, user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/:role')
  updateRoleOfUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: User,
  ): Observable<User> {
    return this.userService.updateRoleOfUser(id, user);
  }
}
