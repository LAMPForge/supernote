import { ConfigService } from "@nestjs/config";

export class EnvironmentService {
  constructor(private configService: ConfigService) {}

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }

  getAppUrl(): string {
    return (
      this.configService.get<string>('APP_URL') ||
      'http://localhost:' + this.getPort()
    );
  }

  getPort(): number {
    return parseInt(this.configService.get<string>('PORT', '3000'));
  }

  getAppSecret(): string {
    return this.configService.get<string>('APP_SECRET');
  }

  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }
}
