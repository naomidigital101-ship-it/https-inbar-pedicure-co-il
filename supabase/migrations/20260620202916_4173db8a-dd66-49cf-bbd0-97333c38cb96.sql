
DO $$
DECLARE
  pairs text[][] := ARRAY[
    ['https://www.nhs.uk/conditions/diabetes/foot-care/', 'https://en.wikipedia.org/wiki/Diabetic_foot'],
    ['https://www.nhs.uk/live-well/healthy-body/foot-care-tips/', 'https://en.wikipedia.org/wiki/Podiatry'],
    ['https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/foot-care/art-20045145', 'https://en.wikipedia.org/wiki/Podiatry'],
    ['https://www.mayoclinic.org/diseases-conditions/diabetes/in-depth/diabetes-management/art-20045704', 'https://en.wikipedia.org/wiki/Diabetes_management'],
    ['https://www.maccabi4u.co.il/14352-he/Maccabi.aspx', 'https://he.wikipedia.org/wiki/%D7%9B%D7%A3_%D7%A8%D7%92%D7%9C_%D7%A1%D7%95%D7%9B%D7%A8%D7%AA%D7%99%D7%AA'],
    ['https://www.maccabi4u.co.il/13611-he/Maccabi.aspx', 'https://he.wikipedia.org/wiki/%D7%A1%D7%95%D7%9B%D7%A8%D7%AA'],
    ['https://www.maccabi4u.co.il/14020-he/Maccabi.aspx', 'https://he.wikipedia.org/wiki/%D7%A4%D7%93%D7%99%D7%A7%D7%95%D7%A8'],
    ['https://www.maccabi4u.co.il/15133-he/Maccabi.aspx', 'https://he.wikipedia.org/wiki/%D7%A4%D7%98%D7%A8%D7%AA_%D7%A6%D7%99%D7%A4%D7%95%D7%A8%D7%A0%D7%99%D7%99%D7%9D'],
    ['https://www.nhs.uk/conditions/cracked-heels/', 'https://en.wikipedia.org/wiki/Cracked_heels'],
    ['https://www.clalit.co.il/he/medical/disease/Pages/shin_splints.aspx', 'https://en.wikipedia.org/wiki/Shin_splints'],
    ['https://www.clalit.co.il/he/medical/disease/Pages/diabetic_foot.aspx', 'https://en.wikipedia.org/wiki/Diabetic_foot'],
    ['https://www.clalit.co.il/he/your_health/family/Pages/foot_health_guide.aspx', 'https://en.wikipedia.org/wiki/Podiatry'],
    ['https://www.clalit.co.il/he/medical/disease/Pages/blisters.aspx', 'https://en.wikipedia.org/wiki/Blister'],
    ['https://www.clalit.co.il/he/lifestyle/physical_activity/Pages/how_to_choose_running_shoes.aspx', 'https://en.wikipedia.org/wiki/Running_shoe'],
    ['https://www.nhs.uk/conditions/diabetes-foot-problems/', 'https://www.iwgdfguidelines.org/'],
    ['https://www.clalit.co.il/he/medical/disease/Pages/Ingrown_toenail.aspx', 'https://en.wikipedia.org/wiki/Ingrown_nail'],
    ['https://www.cdc.gov/diabetes/library/features/healthy-feet.html', 'https://www.cdc.gov/diabetes/about/index.html'],
    ['https://www.clalit.co.il/he/medical/disease/Pages/Onychomycosis.aspx', 'https://en.wikipedia.org/wiki/Onychomycosis'],
    ['https://bjsm.bmj.com/content/51/8/642', 'https://en.wikipedia.org/wiki/Running_injury'],
    ['https://www.nhs.uk/live-well/exercise/running-shoes-trainers-and-gear/', 'https://en.wikipedia.org/wiki/Running_shoe'],
    ['https://www.nhs.uk/conditions/podiatry/', 'https://en.wikipedia.org/wiki/Podiatry'],
    ['https://www.clalit.co.il/he/medical/disease/Pages/cracked_heels.aspx', 'https://en.wikipedia.org/wiki/Cracked_heels']
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
