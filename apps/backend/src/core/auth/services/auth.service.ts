import { Injectable, UnauthorizedException } from "@nestjs/common";
import { EnvironmentService } from "../../../integrations/environment/environment.service";
import { InjectKysely} from "nestjs-kysely";
import { KyselyDB } from "@supernote/database/types/kysely.types";
import { LoginDto } from "../dto/login.dto";
import { UserRepository } from "@supernote/database/repositories/user/user.repository";
import { comparePassword } from "../../../common/helpers";
import { TokensDto } from "../dto/tokens.dto";
import { TokenService } from "./token.service";
import { CreateOwnerUserDto } from '../dto/create-owner-user.dto';
import { SignupService } from './signup.service';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private tokenService: TokenService,
    private signupService: SignupService,
    private environmentService: EnvironmentService,
    @InjectKysely() private readonly db: KyselyDB
  ) {}

  async login(loginDto: LoginDto, workspaceId: string) {
    const user = await this.userRepository.findByEmail(
      loginDto.email,
      workspaceId,
      true
    );

    if (
      !user ||
      !(await comparePassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens: TokensDto = await this.tokenService.generateTokens(user);
    return { tokens };
  }

  async setupWorkspace(setupWorkspaceInput: CreateOwnerUserDto) {
    const user = await this.signupService.initialSetup(setupWorkspaceInput);

    const tokens: TokensDto = await this.tokenService.generateTokens(user);

    return { tokens };
  }
}