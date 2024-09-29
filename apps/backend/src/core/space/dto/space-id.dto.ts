import { IsNotEmpty, IsString } from 'class-validator';

export class SpaceIdDto {
  @IsString()
  @IsNotEmpty()
  spaceId: string;
}
