
DO $$
DECLARE
  pairs text[][] := ARRAY[
    ['https://www.clalit.co.il/he/medical/disease/Pages/psoriasis.aspx', 'https://en.wikipedia.org/wiki/Psoriasis'],
    ['https://www.maccabi4u.co.il/14202-he/Maccabi.aspx', 'https://he.wikipedia.org/wiki/%D7%9B%D7%A3_%D7%A8%D7%92%D7%9C_%D7%A1%D7%95%D7%9B%D7%A8%D7%AA%D7%99%D7%AA'],
    ['https://www.maccabi4u.co.il/13410-he/Maccabi.aspx', 'https://he.wikipedia.org/wiki/%D7%A4%D7%93%D7%99%D7%A7%D7%95%D7%A8'],
    ['https://www.maccabi4u.co.il/12433-he/Maccabi.aspx', 'https://en.wikipedia.org/wiki/Cracked_heels']
  ];
  i int;
BEGIN
  FOR i IN 1..array_length(pairs, 1) LOOP
    UPDATE ai_articles
    SET payload = replace(payload::text, pairs[i][1], pairs[i][2])::jsonb,
        updated_at = now()
    WHERE payload::text LIKE '%' || pairs[i][1] || '%';
  END LOOP;
END $$;
