insert into public.site_settings (key, value, label, section, kind, sort_order) values
('phone_2','+257 69 89 89 47','Téléphone 2','contact','text',31),
('phone_2_link','+25769898947','Téléphone 2 (format lien)','contact','text',32),
('phone_3','+257 61 55 64 67','Téléphone 3','contact','text',33),
('phone_3_link','+25761556467','Téléphone 3 (format lien)','contact','text',34),
('website','www.poly-solutions.bi','Site web','contact','text',35),
('contact_1_name','NSHIMIRIMANA Egide','Personne de contact 1 — nom','contact','text',41),
('contact_1_email','egide.nshimirimana@poly-solutions.bi','Personne de contact 1 — e-mail','contact','text',42),
('contact_2_name','MIKEREGO Emmanuel','Personne de contact 2 — nom','contact','text',43),
('contact_2_email','emmanuel.mikerego@poly-solutions.bi','Personne de contact 2 — e-mail','contact','text',44),
('contact_3_name','NDAYISENGA Advaxe','Personne de contact 3 — nom','contact','text',45),
('contact_3_email','advaxen@poly-solutions.bi','Personne de contact 3 — e-mail','contact','text',46)
on conflict (key) do update set value = excluded.value, label = excluded.label, section = excluded.section, sort_order = excluded.sort_order;

update public.site_settings set value = 'Avenue de l''Innovation, N° 5, Bujumbura, Burundi' where key = 'address';