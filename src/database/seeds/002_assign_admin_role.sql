INSERT INTO users_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'nati@test.com' -- Reemplaza con el email del usuario al que deseas asignar el rol de admin
AND r.role_name = 'admin'
ON CONFLICT DO NOTHING;