import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

export enum AppointmentStatus {
  Pending = 'pending',
  Done = 'done',
  Cancelled = 'cancelled',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'id_user', type: 'uuid' })
  idUser!: string;

  @Column({ name: 'id_doctor', type: 'uuid' })
  idDoctor!: string;

  @Column({ type: 'timestamp' })
  datetime!: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    enumName: 'appointment_status',
    default: AppointmentStatus.Pending,
  })
  status!: AppointmentStatus;

  @Column({ nullable: false })
  motivo!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.appointments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_user' })
  user!: User;

  @ManyToOne(() => User, (user) => user.doctorAppointments, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_doctor' })
  doctor!: User;
}
