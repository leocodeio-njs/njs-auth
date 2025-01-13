import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../../enums/role.enum';
import { ROLES_KEY } from '../../decorator/auth/roles.decorator';
import axios from 'axios';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      //   context.getHandler(),
      //   context.getClass(),
      // ]);
      // if (!requiredRoles) {
      //   return true;
      // }

      // const role_access_token = request.headers['access_token'];

      // if (!role_access_token) {
      // throw this.responseService.buildErrorResponse(
      //   'Authorization header missing',
      //   '',
      //   HttpStatus.UNAUTHORIZED,
      //   'INVALID_TOKEN',
      // );
      // }
      //   const decoded = this.jwtService.verify(role_access_token, {
      //     secret: this.configService.get<string>('JWT_SECRET'),
      //   });

      // console.log(decoded);
      // console.log(requiredRoles);
      // const isRoleAccepted = requiredRoles.some((role) =>
      //   decoded.roles?.includes(role),
      // );

      // console.log(isRoleAccepted);
      return true;
    } catch (error) {
      return false;
    }
  }
}
