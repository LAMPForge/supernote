import { Injectable } from '@nestjs/common';
import { UserRepository } from '@supernote/database/repositories/user/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findById(userId: string, workspaceId: string) {
    return this.userRepository.findById(userId, workspaceId);
  }
}