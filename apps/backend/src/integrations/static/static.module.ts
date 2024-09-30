import { Module, OnModuleInit } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { EnvironmentService } from "../environment/environment.service";
import { join } from "path";
import * as fs from 'node:fs';
import fastifyStatic from '@fastify/static';

@Module({})
export class StaticModule implements OnModuleInit {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly environmentService: EnvironmentService,
  ) {}

  public async onModuleInit() {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const app = httpAdapter.getInstance();

    const frontendDistPath = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'frontend/dist',
    );

    if (fs.existsSync(frontendDistPath)) {
      const indexFilePath = join(frontendDistPath, 'index.html');
      const windowVar = '<!--window-config-->';

      const configString = {
        ENV: this.environmentService.getNodeEnv(),
        APP_URL: this.environmentService.getAppUrl(),
      };

      const windowScriptContent = `<script>window.CONFIG=${JSON.stringify(configString)};</script>`;
      const html = fs.readFileSync(indexFilePath, 'utf8');
      const transformedHtml = html.replace(windowVar, windowScriptContent);

      fs.writeFileSync(indexFilePath, transformedHtml);

      const RENDER_PATH = '*';

      await app.register(fastifyStatic, {
        root: frontendDistPath,
        wildcard: false,
      });

      app.get(RENDER_PATH, (req: any, res: any) => {
        const stream = fs.createReadStream(indexFilePath);
        res.type('text/html').send(stream);
      });
    }
  }
}
