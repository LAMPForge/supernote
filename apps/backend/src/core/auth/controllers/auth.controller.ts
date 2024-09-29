import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import {EnvironmentService} from "../../../integrations/environment/environment.service";
import {AuthService} from "../services/auth.service";
import {LoginDto} from "../dto/login.dto";
import { CreateOwnerUserDto } from '../dto/create-owner-user.dto';
import { SetupGuard } from '../guards/setup.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private environmentService: EnvironmentService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Req() req: any, @Body() loginInput: LoginDto) {
    return this.authService.login(loginInput, req.raw.workspaceId);
  }

  @UseGuards(SetupGuard)
  @HttpCode(HttpStatus.OK)
  @Post('setup')
  async setupWorkspace(
    @Body() setupWorkspaceInput: CreateOwnerUserDto,
  ) {
    return this.authService.setupWorkspace(setupWorkspaceInput);
  }
}
