CREATE POLICY "Admins manage instagram-posts bucket"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'instagram-posts' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'instagram-posts' AND public.has_role(auth.uid(), 'admin'));