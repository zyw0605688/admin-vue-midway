import { Controller, Get } from '@midwayjs/core';

@Controller()
export class HomeController {
  @Get('/',{ignoreGlobalPrefix: true})
  async home(): Promise<string> {
    return 'Hello Midwayjs!';
  }
}
