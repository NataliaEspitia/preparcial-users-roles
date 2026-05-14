import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,

    private readonly rolesService: RolesService,
  ) {}

  async create(userData: Partial<User>) {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

  async findById(id: string) {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async findMe(id: string) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      roles: user.roles?.map((role) => role.roleName) ?? [],
    };
  }

  async findAll() {
    try {
      const users = await this.usersRepository.find({
        relations: ['roles'],
      });

      return users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles?.map((role) => role.roleName) ?? [],
      }));
    } catch {
      throw new InternalServerErrorException('Error al listar usuarios');
    }
  }

  async assignRoles(userId: string, assignRolesDto: AssignRolesDto) {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const roles = await this.rolesService.findByNames(assignRolesDto.roles);

    if (roles.length !== assignRolesDto.roles.length) {
      throw new BadRequestException('roles inválidos');
    }

    user.roles = roles;

    await this.usersRepository.save(user);

    return {
      message: 'Roles asignados',
    };
  }
}
