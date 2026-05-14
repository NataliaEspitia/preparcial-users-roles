CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id UUID NOT NULL,
  doctor_id UUID NOT NULL,

  appointment_date TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
  reason VARCHAR(255),

  created_at TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_appointments_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_appointments_doctor
    FOREIGN KEY (doctor_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);