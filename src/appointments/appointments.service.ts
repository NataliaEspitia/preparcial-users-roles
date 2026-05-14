import {
  BadRequestException,
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class AppointmentsService {
  findUserAppointments(userId: string) {
    if (!userId) {
      throw new NotFoundException('No fue posible encontrar sus appointments');
    }

    return {
      message: 'Sus appointments han sido encontrados con éxito',
      appointments: [],
    };
  }

  createAppointment(userId: string, body: any) {
    if (!userId || !body) {
      throw new BadRequestException(
        'No fue posible crear su cita, intente de nuevo',
      );
    }

    return {
      message: 'Se ha creado su cita con éxito',
    };
  }

  cancelAppointment(userId: string, appointmentId: string) {
    if (!userId || !appointmentId) {
      throw new MethodNotAllowedException(
        'No fue posible cancelar su cita',
      );
    }

    return {
      message: 'Se ha cancelado su cita con éxito',
    };
  }

  findDoctorAppointments(doctorId: string) {
    if (!doctorId) {
      throw new NotFoundException(
        'No fue posible encontrar sus appointments doctor',
      );
    }

    return {
      message: 'Estos son sus appointments doctor',
      appointments: [],
    };
  }

  updateAppointmentStatus(
    doctorId: string,
    appointmentId: string,
    body: any,
  ) {
    if (!doctorId || !appointmentId || !body) {
      throw new BadRequestException(
        'No fue posible cambiar el estado de appointment',
      );
    }

    return {
      message: 'Se cambió el estado del appointment',
    };
  }

  findGlobalAppointments(adminId: string) {
    if (!adminId) {
      throw new NotFoundException(
        'No fue posible encontrar los appointments globales',
      );
    }

    return {
      message: 'Estos son los appointments globales',
      appointments: [],
    };
  }
}