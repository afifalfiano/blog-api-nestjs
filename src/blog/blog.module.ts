import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { BlogEntryEntity } from './model/blog-entry.entity';
import { BlogController } from './controller/blog/blog.controller';
import { BlogService } from './service/blog/blog.service';

@Module({
    imports: [TypeOrmModule.forFeature([BlogEntryEntity]), AuthModule, UserModule],
    controllers: [BlogController],
    providers: [BlogService]
})
export class BlogModule {}
