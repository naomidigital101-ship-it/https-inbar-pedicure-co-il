
DO $$
DECLARE
  pairs text[][] := ARRAY[
    ['dry-cracked-heels-treatment','dry-skin-cracked-heels-care-guide'],
    ['treating-dry-cracked-heels','dry-skin-cracked-heels-care-guide'],
    ['how-to-cut-toenails-correctly','how-to-cut-toenails-correctly-prevent-ingrown-toenail'],
    ['piteret-tsipornayim-beragliim','nail-fungus-causes-and-treatment'],
    ['peteret-tsipornaim','nail-fungus-causes-and-treatment'],
    ['tipul-be-piteret-kef-regel','nail-fungus-causes-and-treatment'],
    ['foot-fungus-prevention','is-nail-fungus-contagious'],
    ['how-to-choose-running-shoes','eich-livchor-naalei-ritza'],
    ['how-to-choose-the-right-shoes','eich-livchor-naalei-ritza'],
    ['choosing-comfortable-shoes','eich-livchor-naalei-ritza'],
    ['foot-types-and-pronation','eich-livchor-naalei-ritza'],
    ['yabalot-viraliyot-ve-lachatz-bakaf-haregel','viral-plantar-wart'],
    ['tsiporen-choderanit','orthonyxia-nail-bracing-for-ingrown-toenail'],
    ['tsiporen-khodranit','orthonyxia-nail-bracing-for-ingrown-toenail'],
    ['diabetic-foot-care','diabetic-foot-daily-self-check-guide'],
    ['callus-and-corns','hard-callus-vs-wart'],
    ['foot-stretches-and-exercises','shin-splints-causes-prevention-guide'],
    ['custom-orthotics-guide','kavim-ba-akev-boker-dorban'],
    ['midrasim-le-keev-raglayim','kavim-ba-akev-boker-dorban']
  ];
  i int;
  old_path text;
  new_path text;
  old_quoted text;
  new_quoted text;
BEGIN
  FOR i IN 1..array_length(pairs, 1) LOOP
    old_path := '/article/' || pairs[i][1];
    new_path := '/article/' || pairs[i][2];
    old_quoted := '"' || pairs[i][1] || '"';
    new_quoted := '"' || pairs[i][2] || '"';

    UPDATE ai_articles
    SET payload = replace(replace(payload::text, old_path, new_path), old_quoted, new_quoted)::jsonb,
        updated_at = now()
    WHERE payload::text LIKE '%' || old_path || '%'
       OR payload::text LIKE '%' || old_quoted || '%';
  END LOOP;
END $$;
