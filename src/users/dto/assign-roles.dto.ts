import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AssignRolesDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'roles inválidos' })
  @IsString({ each: true })
  roles!: string[];
}
