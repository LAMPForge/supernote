import {Injectable, UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import {UserRepository} from "@supernote/database/repositories/user/user.repository";
import {WorkspaceRepository} from "@supernote/database/repositories/workspace/workspace.repository";
import {EnvironmentService} from "../../../integrations/environment/environment.service";
import { FastifyRequest } from 'fastify';
import {JwtPayload, JwtType} from "../dto/jwt-payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userRepository: UserRepository,
    private workspaceRepository: WorkspaceRepository,
    private readonly environmentService: EnvironmentService,
  ) {
    super({
      jwtFromRequest: (request: FastifyRequest) => {
        let accessToken = null;

        try {
          accessToken = JSON.parse(request.cookies?.authTokens)?.accessToken;
        } catch {}

        return accessToken || this.extractTokenFromHeader(request);
      },
      ignoreExpiration: false,
      secretOrKey: environmentService.getAppSecret(),
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: JwtPayload) {
    if (!payload.workspaceId || payload.type !== JwtType.ACCESS) {
      throw new UnauthorizedException('Invalid token');
    }

    const workspace = await this.workspaceRepository.findById(payload.workspaceId);

    if (!workspace) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.userRepository.findById(payload.sub, payload.workspaceId);

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      user,
      workspace,
    }
  }

  private extractTokenFromHeader(request: FastifyRequest): string | null {
    const header = request.headers.authorization;
    if (!header) {
      return null;
    }

    const parts = header.split(' ');
    if (parts.length !== 2) {
      return null;
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
      return null;
    }

    return token;
  }
}
