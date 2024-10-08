import { Module } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './services/page.service';

@Module({
  controllers: [PageController],
  providers: [PageService],
  exports: [PageService],
})
export class PageModule {}
