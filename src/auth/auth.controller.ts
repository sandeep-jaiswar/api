import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  @Get('login')
  async login(@Res() res: Response): Promise<void> {
    const authorizationUrl = this.authService.client.authorizationUrl({
      scope: 'openid email profile',
      response_mode: 'form_post',
    });
    res.redirect(authorizationUrl);
  }

  @Post('callback')
  async callback(@Req() req: Request, @Res() res: Response): Promise<void> {
    const params = this.authService.client.callbackParams(req);
    const tokenSet = await this.authService.client.callback(
      this.configService.get<string>('REDIRECT_URI'),
      params,
    );
    const data = await this.authService.generateTokens(tokenSet);
    let user;
    user = await this.userService.findOneByEmail(tokenSet.claims().email);
    if (!user) {
      user = await this.userService.create({
        ...tokenSet.claims(),
      });
    }
    res.cookie('access_token', data.access_token, { httpOnly: true });
    res.cookie('refresh_token', data.refresh_token, { httpOnly: true });
    res.send({
      ...user,
    });
  }
}
