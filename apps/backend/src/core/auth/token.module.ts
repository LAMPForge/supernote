import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentService } from '../../integrations/environment/environment.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [EnvironmentService],
      useFactory: async (environmentService: EnvironmentService) => {
        return {
          secret: environmentService.getAppSecret(),
          signOptions: {
            expiresIn: environmentService.getJwtTokenExpiresIn(),
            issuer: 'SuperNote',
          },
        };
      },
    }),
  ],
})
export class TokenModule {}
