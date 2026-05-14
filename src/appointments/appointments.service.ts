import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

interface AuthUser {
  id: string;
  roles: string[];
}

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    const doctor = await this.usersRepository.findOne({
      where: { id: createAppointmentDto.id_doctor },
      relations: ['roles'],
    });

    if (!doctor) {
      throw new NotFoundException('Doctor no encontrado');
    }

    const isDoctor = doctor.roles?.some((role) => role.roleName === 'doctor');

    if (!isDoctor) {
      throw new BadRequestException('El usuario seleccionado no es doctor');
    }

    const appointment = this.appointmentsRepository.create({
      idUser: userId,
      idDoctor: createAppointmentDto.id_doctor,
      datetime: new Date(createAppointmentDto.datetime),
      motivo: createAppointmentDto.motivo,
      status: AppointmentStatus.Pending,
    });

    const savedAppointment =
      await this.appointmentsRepository.save(appointment);

    return this.findOneForUser(savedAppointment.id, {
      id: userId,
      roles: ['user'],
    });
  }

  async findAllForUser(authUser: AuthUser) {
    const relations = ['user', 'doctor'];

    if (authUser.roles.includes('admin')) {
      const appointments = await this.appointmentsRepository.find({
        relations,
      });
      return appointments.map((appointment) => this.toResponse(appointment));
    }

    if (authUser.roles.includes('doctor')) {
      const appointments = await this.appointmentsRepository.find({
        where: { idDoctor: authUser.id },
        relations,
      });

      return appointments.map((appointment) => this.toResponse(appointment));
    }

    const appointments = await this.appointmentsRepository.find({
      where: { idUser: authUser.id },
      relations,
    });

    return appointments.map((appointment) => this.toResponse(appointment));
  }

  async findOneForUser(id: string, authUser: AuthUser) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: ['user', 'doctor'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment no encontrado');
    }

    this.ensureCanRead(appointment, authUser);

    return this.toResponse(appointment);
  }

  async remove(id: string, authUser: AuthUser) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment no encontrado');
    }

    const canDelete =
      authUser.roles.includes('admin') || appointment.idUser === authUser.id;

    if (!canDelete) {
      throw new ForbiddenException('No autorizado');
    }

    await this.appointmentsRepository.remove(appointment);

    return {
      message: 'Appointment eliminado',
    };
  }

  async updateStatus(
    id: string,
    updateAppointmentStatusDto: UpdateAppointmentStatusDto,
    authUser: AuthUser,
  ) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment no encontrado');
    }

    const canUpdate =
      authUser.roles.includes('admin') || appointment.idDoctor === authUser.id;

    if (!canUpdate) {
      throw new ForbiddenException('No autorizado');
    }

    appointment.status = updateAppointmentStatusDto.status;

    const savedAppointment =
      await this.appointmentsRepository.save(appointment);

    return this.findOneForUser(savedAppointment.id, authUser);
  }

  private ensureCanRead(appointment: Appointment, authUser: AuthUser) {
    const canRead =
      authUser.roles.includes('admin') ||
      appointment.idDoctor === authUser.id ||
      appointment.idUser === authUser.id;

    if (!canRead) {
      throw new ForbiddenException('No autorizado');
    }
  }

  private toResponse(appointment: Appointment) {
    return {
      id: appointment.id,
      id_user: appointment.idUser,
      id_doctor: appointment.idDoctor,
      datetime: appointment.datetime,
      status: appointment.status,
      motivo: appointment.motivo,
      created_at: appointment.createdAt,
      user: appointment.user
        ? {
            id: appointment.user.id,
            email: appointment.user.email,
            name: appointment.user.name,
          }
        : undefined,
      doctor: appointment.doctor
        ? {
            id: appointment.doctor.id,
            email: appointment.doctor.email,
            name: appointment.doctor.name,
          }
        : undefined,
    };
  }
}
