import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/modules/user/persistance/User.entity';
import { ROLES_KEY } from './roles.decorator';
import { debug } from 'console';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request['user']
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}