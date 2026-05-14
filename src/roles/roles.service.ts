import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const existingRole = await this.rolesRepository.findOne({
      where: { roleName: createRoleDto.role_name },
    });

    if (existingRole) {
      throw new ConflictException('role_name ya existe');
    }

    const role = this.rolesRepository.create({
      roleName: createRoleDto.role_name,
      description: createRoleDto.description,
    });

    const savedRole = await this.rolesRepository.save(role);

    return {
      message: 'Rol creado con éxito',
      roleId: savedRole.id,
    };
  }

  async findAll() {
    try {
      const roles = await this.rolesRepository.find();

      return roles.map((role) => ({
        id: role.id,
        role_name: role.roleName,
        description: role.description,
      }));
    } catch {
      throw new InternalServerErrorException('Error al obtener roles');
    }
  }

  async findByNames(roleNames: string[]) {
    return this.rolesRepository.find({
      where: {
        roleName: In(roleNames),
      },
    });
  }

  async findUserDefaultRole() {
    return this.rolesRepository.findOne({
      where: { roleName: 'user' },
    });
  }
}
