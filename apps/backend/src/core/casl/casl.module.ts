import { Global, Module } from '@nestjs/common';
import WorkspaceAbilityFactory from './abilities/workspace-ability.factory';
import SpaceAbilityFactory from './abilities/space-ability.factory';

@Global()
@Module({
  providers: [WorkspaceAbilityFactory, SpaceAbilityFactory],
  exports: [WorkspaceAbilityFactory, SpaceAbilityFactory],
})
export class CaslModule {}
