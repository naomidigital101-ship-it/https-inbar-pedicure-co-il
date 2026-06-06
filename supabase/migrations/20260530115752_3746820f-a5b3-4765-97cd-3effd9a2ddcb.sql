UPDATE auth.users
SET encrypted_password = crypt('tchdhkutdo', gen_salt('bf')),
    updated_at = now()
WHERE email = 'naomi.digital101@gmail.com';