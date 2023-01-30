import { KakaoAuthGuard } from './guard/kakaoAuth.guard';
import { AuthService } from './auth.service';
import {
  Controller,
  Get,
  Res,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from './dtos/auth.login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // /**
  //  * 구글 로그인 호출
  //  * 프론트에서 GET 요청으로 google 인증 호출
  //  */
  // @Get('google')
  // @UseGuards(AuthGuard('google'))
  // async googleAuth() {}

  // /**
  //  * 구글 콜백 (res : 액세스, 리프레쉬 )
  //  * @param id UserEntity id : string
  //  * @param res {token, 2 arg}
  //  */
  // @Get('google/callback') // google 인증 후 돌아오는 callback 주소
  // @UseGuards(AuthGuard('google')) // google strategy 인증 과정
  // async googleAuthRedirect(@getUser() id: string, @Res() res: Response) {
  //   const token = await this.authService.createToken(id);
  //   const { AccessToken, RefreshToken } = token;
  //   res.header('Authorization', AccessToken);
  //   res.header('refreshToken', RefreshToken);
  //   res.send(token);
  // }
  @ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 로그인을 하는 API입니다.',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('kakao')
  async kakaologin() {
    return;
  }

  @ApiOperation({
    summary: '카카오 로그인 콜백',
    description: '카카오 로그인시 콜백 라우터입니다.',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('kakao/callback')
  async kakaoCallback(@Req() req, @Res() res: Response) {
    const { AccessToken, RefreshToken } = req.token;
    res.setHeader('Authrization', AccessToken);
    res.setHeader('RefreshToken', RefreshToken);
    res.cookie('Authrization', AccessToken);
    res.cookie('RefreshToken', RefreshToken);
    res.redirect('http://localhost:3000/main');
    res.end();
  }
  // /**
  //  * 프론트에서 GET 네이버 요청
  //  */
  // @Get('naver')
  // @UseGuards(AuthGuard('naver'))
  // async naverAuth() {}

  // /**
  //  * 네이버 콜백 (res : 액세스, 리프레쉬 )
  //  * @param id UserEntity id : string
  //  * @param res {token, 2 arg}
  //  */
  // @Get('naver/callback') //'naver 인증 후 돌아오는 callback 주소
  // @UseGuards(AuthGuard('naver')) //'naver strategy 인증 과정
  // async naverAuthRedirect(@getUser() id: string, @Res() res: Response) {
  //   const token = await this.authService.createToken(id);
  //   const { AccessToken, RefreshToken } = token;
  //   res.header('Authorization', AccessToken);
  //   res.header('refreshToken', RefreshToken);
  //   res.send(token);
  // }

  @Post('local') // local login
  @UseGuards()
  async localAuth(@Body() body: AuthLoginDto, @Res() res: Response) {
    const { id } = await this.authService.localLogin(body);
    const token = await this.authService.createToken({ id });
    const { AccessToken, RefreshToken } = token;
    res.header('Authorization', AccessToken);
    res.header('refreshToken', RefreshToken);
    res.send(token);
  }
}
