INSERT INTO appointments (user_id, doctor_id, appointment_date, status, reason)
SELECT
  patient.id,
  doctor.id,
  now() + interval '1 day',
  'scheduled',
  'Consulta general'
FROM users patient, users doctor
WHERE patient.email = 'nati@test.com'
AND doctor.email = 'doctor@test.com';