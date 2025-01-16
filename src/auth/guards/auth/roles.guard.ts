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
      const request = context.switchToHttp().getRequest();
      const roles = request.body.user_meta_data.roles;
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      console.log(requiredRoles);
      if (!requiredRoles) {
        return true;
      }

      const isRoleAccepted = requiredRoles.some((role) =>
        roles?.includes(role),
      );

      console.log(isRoleAccepted);
      return isRoleAccepted;
    } catch (error) {
      return false;
    }
  }
}
