BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE appointment_status AS ENUM ('pending', 'done', 'cancelled');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_user UUID NOT NULL,
  id_doctor UUID NOT NULL,
  datetime TIMESTAMP NOT NULL,
  status appointment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  motivo VARCHAR(255) NOT NULL,

  CONSTRAINT fk_appointments_user
    FOREIGN KEY (id_user)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_appointments_doctor
    FOREIGN KEY (id_doctor)
    REFERENCES users(id)
    ON DELETE CASCADE
);
