import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './service/auth/auth.service';
import { RolesGuard } from './service/auth/guard/roles.guard';
import { JwtAuthGuard } from './service/auth/guard/jwt-guard';
import { JwtStrategy } from './service/auth/guard/jwt-strategy';
import { UserModule } from 'src/user/user.module';
import { UserIsUser } from './service/auth/guard/user-is-user.guard';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '3600s',
        },
      }),
    }),
  ],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy, UserIsUser],
  exports: [AuthService]
})
export class AuthModule {}
