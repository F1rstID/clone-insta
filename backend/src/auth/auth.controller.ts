import { AuthLoginDto } from './dtos/auth.login.dto';
import { getUser } from 'src/common/decorator/user.data.decorator';
import { AuthService } from './auth.service';
import {
  Controller,
  Get,
  Res,
  UseGuards,
  Post,
  Req,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * 구글 로그인 호출
   * 프론트에서 GET 요청으로 google 인증 호출
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  /**
   * 구글 콜백 (res : 액세스, 리프레쉬 )
   * @param id UserEntity id : string
   * @param res {token, 2 arg}
   */
  @Get('google/callback') // google 인증 후 돌아오는 callback 주소
  @UseGuards(AuthGuard('google')) // google strategy 인증 과정
  async googleAuthRedirect(@getUser() id: string, @Res() res: Response) {
    const token = await this.authService.createToken(id, res);
    res.send(token);
  }

  /**
   * 프론트에서 GET 요청으로 kakao 인증 호출
   */
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth() {}

  /**
   * 카카오 콜백 (res : 액세스, 리프레쉬 )
   * @param id UserEntity id : string
   * @param res {token, 2 arg}
   */
  @Get('kakao/callback') // google 인증 후 돌아오는 callback 주소
  @UseGuards(AuthGuard('kakao')) // kakao strategy 인증 과정
  async kakaoAuthRedirect(@getUser() id: string, @Res() res: Response) {
    const token = await this.authService.createToken(id, res);
    res.send(token);
  }

  /**
   * 프론트에서 GET 네이버 요청
   */
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  async naverAuth() {}

  /**
   * 네이버 콜백 (res : 액세스, 리프레쉬 )
   * @param id UserEntity id : string
   * @param res {token, 2 arg}
   */
  @Get('naver/callback') //'naver 인증 후 돌아오는 callback 주소
  @UseGuards(AuthGuard('naver')) //'naver strategy 인증 과정
  async naverAuthRedirect(@getUser() id: string, @Res() res: Response) {
    const token = await this.authService.createToken(id, res);
    res.send(token);
  }

  @Post('local') // local login
  @UseGuards()
  async localAuth(@Body() body: AuthLoginDto, @Res() res: Response) {
    const { id } = await this.authService.localLogin(body);
    const token = await this.authService.createToken({ id }, res);
    res.send(token);
  }
}
