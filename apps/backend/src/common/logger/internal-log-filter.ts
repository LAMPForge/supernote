import { ConsoleLogger } from '@nestjs/common';

export class InternalLogFilter extends ConsoleLogger {
  static contextsToIgnore = [
    'InstanceLoader',
    'RoutesResolver',
    'RouterExplorer',
  ];
  private allowedLogLevels: string[];

  constructor() {
    super();
    this.allowedLogLevels =
      process.env.NODE_ENV === 'PRODUCTION'
        ? ['log', 'error', 'fatal']
        : ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'];
  }

  private isLogLevelAllowed(level: string): boolean {
    return this.allowedLogLevels.includes(level);
  }

  log(message: any, context?: string) {
    if (
      this.isLogLevelAllowed('log') &&
      (process.env.NODE_ENV !== 'production' ||
        !InternalLogFilter.contextsToIgnore.includes(context))
    ) {
      super.log(message, context);
    }
  }

  warn(message: any, context?: string): void {
    if (this.isLogLevelAllowed('warn')) {
      super.warn(message, context);
    }
  }

  error(message: any, stack?: string, context?: string): void {
    if (this.isLogLevelAllowed('error')) {
      super.error(message, stack, context);
    }
  }

  debug(message: any, context?: string): void {
    if (this.isLogLevelAllowed('debug')) {
      super.debug(message, context);
    }
  }

  verbose(message: any, context?: string): void {
    if (this.isLogLevelAllowed('verbose')) {
      super.verbose(message, context);
    }
  }
}
