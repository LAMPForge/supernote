import { Injectable, NestMiddleware } from '@nestjs/common';
import { WorkspaceRepository } from '@supernote/database/repositories/workspace/workspace.repository';
import { EnvironmentService } from '../../integrations/environment/environment.service';
import { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class DomainMiddleware implements NestMiddleware {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private environmentService: EnvironmentService,
  ) {}

  async use(
    req: FastifyRequest['raw'],
    res: FastifyReply['raw'],
    next: () => void,
  ) {
    const workspace = await this.workspaceRepository.findFirst();
    if (!workspace) {
      (req as any).workspaceId = null;
        return next();
    }

    (req as any).workspaceId = workspace.id;
    (req as any).workspace = workspace;

    next();
  }
}