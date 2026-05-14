import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';

interface AuthenticatedRequest {
  user: {
    id: string;
    email: string;
    roles: string[];
  };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Roles('user')
  @Post()
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.appointmentsService.create(
      createAppointmentDto,
      request.user.id,
    );
  }

  @Roles('user', 'doctor', 'admin')
  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.appointmentsService.findAllForUser(request.user);
  }

  @Roles('user', 'doctor', 'admin')
  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.appointmentsService.findOneForUser(id, request.user);
  }

  @Roles('user', 'admin')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.appointmentsService.remove(id, request.user);
  }

  @Roles('doctor', 'admin')
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.appointmentsService.updateStatus(
      id,
      updateAppointmentStatusDto,
      request.user,
    );
  }
}
