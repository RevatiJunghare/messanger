import { Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy
  ) {}

  @Get('auth')
  async getUsers(){
    return this.authService.send({
        cmd:'get-user'
      },{}
      )
  }

  @Post('auth')
  async postUser(){
    return this.authService.send({
        cmd:'post-user'
      },{}
      )
  }
}
