import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  id_doctor!: string;

  @IsDateString()
  datetime!: string;

  @IsString()
  @IsNotEmpty()
  motivo!: string;
}
