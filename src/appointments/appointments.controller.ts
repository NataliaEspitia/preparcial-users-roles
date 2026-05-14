import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AppointmentsService } from './appointments.service';

@Controller('app/users')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Get(':id/appointments')
  findUserAppointments(@Param('id') userId: string) {
    return this.appointmentsService.findUserAppointments(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @Post(':id/appointments')
  createAppointment(@Param('id') userId: string, @Body() body: any) {
    return this.appointmentsService.createAppointment(userId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @HttpCode(HttpStatus.OK)
  @Delete(':id/appointments/:id_a')
  cancelAppointment(
    @Param('id') userId: string,
    @Param('id_a') appointmentId: string,
  ) {
    return this.appointmentsService.cancelAppointment(userId, appointmentId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor')
  @Get(':id_d/appointments/doctor')
  findDoctorAppointments(@Param('id_d') doctorId: string) {
    return this.appointmentsService.findDoctorAppointments(doctorId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('doctor')
  @Patch(':id_d/appointments/:id_a')
  updateAppointmentStatus(
    @Param('id_d') doctorId: string,
    @Param('id_a') appointmentId: string,
    @Body() body: any,
  ) {
    return this.appointmentsService.updateAppointmentStatus(
      doctorId,
      appointmentId,
      body,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get(':id/appointments/global')
  findGlobalAppointments(@Param('id') adminId: string) {
    return this.appointmentsService.findGlobalAppointments(adminId);
  }
}