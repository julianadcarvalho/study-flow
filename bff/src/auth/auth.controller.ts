import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req, @Res() res: Response) {
    const redirectUrl = process.env.FRONTEND_REDIRECT_URL;
    res.redirect(redirectUrl);
  }

  @Get('me')
  getProfile(@Req() req) {
    if (!req.user) {
      throw new UnauthorizedException();
    }
    return req.user;
  }
}
