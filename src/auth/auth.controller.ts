import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
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
    res.send({
      access_token: tokenSet.access_token,
      id_token: tokenSet.id_token,
      refresh_token: tokenSet.refresh_token,
      ...tokenSet,
    });
    // Here you can use the `tokenSet` to authenticate the user and generate access and refresh tokens
  }
}
