// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(user: any): string {
    const payload = { sub: user.email, name: user.name };
    return this.jwtService.sign(payload);
  }
}
