import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/user/models/user.interface';
import { UserService } from 'src/user/service/user/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: User): Observable<User> {
    return this.userService.create(user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Observable<User> {
    return this.userService.findOne(id);
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
}
