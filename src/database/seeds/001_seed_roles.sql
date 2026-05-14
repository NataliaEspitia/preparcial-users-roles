INSERT INTO roles (role_name, description)
VALUES
  ('admin', 'Administrador del sistema'),
  ('doctor', 'Usuario doctor'),
  ('user', 'Usuario básico')
ON CONFLICT (role_name) DO NOTHING;