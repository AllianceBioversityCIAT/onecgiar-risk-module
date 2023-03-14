import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiOkResponse,
  ApiProperty,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'entities/user.entitiy';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
class UserLogin {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBasicAuth()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() userLogin: UserLogin) {
    return this.authService.login(req.user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type:User,
    description:'hit with Barer token to get logedin user profile'
  })
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
