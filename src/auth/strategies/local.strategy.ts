import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthorizationService } from '../services/authorization.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    
    // private authService: AuthorizationService

  ) {
    super({
      usernameField: 'identifier', // Can be email or mobile
    });
  }

  async validate(identifier: string, password: string): Promise<any> {
    // const user = await this.authService.validateUser(identifier, password);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user;
    return true;
  }
}
