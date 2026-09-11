
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin','editor','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- SITE SETTINGS
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  label text NOT NULL DEFAULT '',
  section text NOT NULL DEFAULT 'general',
  kind text NOT NULL DEFAULT 'text',
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- SERVICES
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Code2',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  points text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write services" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CORE VALUES
CREATE TABLE public.core_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text NOT NULL DEFAULT 'Sparkles',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.core_values TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.core_values TO authenticated;
GRANT ALL ON public.core_values TO service_role;
ALTER TABLE public.core_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read values" ON public.core_values FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write values" ON public.core_values FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_core_values_updated BEFORE UPDATE ON public.core_values FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PROJECTS
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text NOT NULL DEFAULT '',
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  points text[] NOT NULL DEFAULT '{}',
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read projects" ON public.projects FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ACHIEVEMENTS
CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.achievements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read achievements" ON public.achievements FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write achievements" ON public.achievements FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_achievements_updated BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- PARTNERS
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'IMF',
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.partners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partners TO authenticated;
GRANT ALL ON public.partners TO service_role;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read partners" ON public.partners FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write partners" ON public.partners FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_partners_updated BEFORE UPDATE ON public.partners FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- TEAM
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  email text,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Building2',
  category text NOT NULL DEFAULT 'direction',
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read team" ON public.team_members FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins write team" ON public.team_members FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_team_updated BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- NEWS
CREATE TABLE public.news_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  cover_url text,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news_posts TO authenticated;
GRANT ALL ON public.news_posts TO service_role;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published news" ON public.news_posts FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "admins read all news" ON public.news_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins write news" ON public.news_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_news_updated BEFORE UPDATE ON public.news_posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CONTACT MESSAGES
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  organization text,
  request_type text NOT NULL DEFAULT 'Information',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send a message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins update messages" ON public.contact_messages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- SEED SETTINGS
INSERT INTO public.site_settings (key, value, label, section, kind, sort_order) VALUES
('company_name','POLY-SOLUTIONS','Nom de la société','identite','text',1),
('company_legal','POLY-SOLUTIONS SPRL','Raison sociale complète','identite','text',2),
('company_tagline','SPRL · Bujumbura','Sous-titre du logo','identite','text',3),
('nif','4002537647','NIF','identite','text',4),
('rc','0053273/24','Registre de commerce','identite','text',5),
('phone','+257 61 00 40 75','Téléphone','contact','text',1),
('phone_link','+25761004075','Téléphone (format lien)','contact','text',2),
('email','info@poly-solutions.bi','Adresse e-mail','contact','text',3),
('address','Avenue de l''Innovation N° 5, Bujumbura','Adresse du siège','contact','text',4),
('hours','Lundi – Vendredi, 08h00 – 17h00','Heures d''ouverture','contact','text',5),
('hero_eyebrow','Ingénierie logicielle · Burundi','Hero — surtitre','accueil','text',1),
('hero_title','La transformation numérique des entreprises et institutions burundaises','Hero — titre','accueil','text',2),
('hero_subtitle','POLY-SOLUTIONS SPRL conçoit des logiciels sur mesure et digitalise les processus d''affaires. De la microfinance rurale aux institutions publiques, nous transformons les méthodes de travail en outils numériques fiables et appropriés par leurs utilisateurs.','Hero — texte','accueil','textarea',3),
('hero_cta','Demander une démonstration','Hero — bouton principal','accueil','text',4),
('stat1_value','12+','Chiffre 1 — valeur','accueil','text',5),
('stat1_label','IMF partenaires accompagnées','Chiffre 1 — légende','accueil','text',6),
('stat2_value','2017','Chiffre 2 — valeur','accueil','text',7),
('stat2_label','Première mission de terrain','Chiffre 2 — légende','accueil','text',8),
('stat3_value','A-CAT','Chiffre 3 — valeur','accueil','text',9),
('stat3_label','Outil digital déployé','Chiffre 3 — légende','accueil','text',10),
('stat4_value','4','Chiffre 4 — valeur','accueil','text',11),
('stat4_label','Pôles d''expertise','Chiffre 4 — légende','accueil','text',12),
('about_title','Une société burundaise à la croisée du numérique et du terrain','À propos — titre','apropos','text',1),
('about_p1','POLY-SOLUTIONS est une société privée à responsabilité limitée (SPRL) de droit burundais, dont le siège social est établi Avenue de l''Innovation N° 5 à Bujumbura. Née de la rencontre entre informaticiens, économistes et agronomes, elle met la technologie au service de secteurs longtemps restés à l''écart de la digitalisation.','À propos — paragraphe 1','apropos','textarea',2),
('about_p2','Depuis 2017, nos équipes interviennent auprès des institutions de microfinance, des organisations internationales et des producteurs agricoles. Cette expérience de terrain nourrit chacun de nos développements logiciels : des outils réellement utilisés, parce que conçus avec ceux qui les utilisent.','À propos — paragraphe 2','apropos','textarea',3),
('about_legal','Statut juridique : SPRL de droit burundais','À propos — statut juridique','apropos','text',4),
('services_title','Quatre domaines pour couvrir tout le cycle de votre projet numérique','Services — titre','services','text',1),
('services_intro','Notre pôle d''expertise réunit informaticiens, économistes et agronomes pour accompagner chaque étape de votre projet.','Services — introduction','services','textarea',2),
('projects_title','Réalisations et produits phares','Réalisations — titre','realisations','text',1),
('projects_intro','Des projets déployés sur le terrain, avec des institutions de microfinance et des organisations internationales.','Réalisations — introduction','realisations','textarea',2),
('partners_title','Un réseau d''institutions et de partenaires de terrain','Partenaires — titre','partenaires','text',1),
('partners_intro','Nous travaillons aux côtés des institutions de microfinance burundaises et d''organisations internationales.','Partenaires — introduction','partenaires','textarea',2),
('team_title','Une direction académique et des experts de terrain','Équipe — titre','equipe','text',1),
('team_intro','Notre équipe associe direction académique, ingénieurs logiciels, économistes et agronomes.','Équipe — introduction','equipe','textarea',2),
('news_title','Actualités','Actualités — titre','actualites','text',1),
('news_intro','Nos dernières nouvelles, déploiements et missions de terrain.','Actualités — introduction','actualites','textarea',2),
('contact_title','Parlons de votre projet numérique','Contact — titre','contact','text',6),
('contact_intro','Demandez une démonstration de l''A-CAT ou un devis pour votre projet : notre équipe vous répond sous 48 heures.','Contact — introduction','contact','textarea',7),
('footer_note','POLY-SOLUTIONS SPRL — Société privée à responsabilité limitée de droit burundais.','Pied de page — mention','general','textarea',1);

INSERT INTO public.services (icon,title,description,points,sort_order) VALUES
('Code2','Développement de logiciels sur mesure','Applications web et mobiles conçues autour de vos métiers : plateformes de gestion, portails clients, applications terrain fonctionnant en zones à faible connectivité.','{"Applications Web & Mobile","Plateformes métier","Maintenance et support utilisateurs"}',1),
('Workflow','Digitalisation & solutions FinTech','Dématérialisation des processus d''affaires et outils financiers digitaux pour les institutions de microfinance, coopératives et entreprises.','{"Analyse et scoring de crédit","Workflows d''approbation","Tableaux de bord de pilotage"}',2),
('Network','Intégration de systèmes & architecture','Interconnexion de vos systèmes existants, migration de données et conception d''architectures fiables, sécurisées et évolutives.','{"API et interopérabilité","Migration de données","Sécurité et sauvegardes"}',3),
('Compass','Conseil stratégique et consulting IT','Accompagnement des directions dans la définition et la conduite de leur feuille de route numérique, du diagnostic à l''appropriation par les équipes.','{"Diagnostic et feuille de route","Formation des utilisateurs","Conduite du changement"}',4);

INSERT INTO public.core_values (icon,title,description,sort_order) VALUES
('Sparkles','Innovation','Des solutions adaptées aux réalités locales, pensées pour le terrain burundais.',1),
('Award','Excellence','Une exigence de qualité et de rigueur à chaque étape de nos projets.',2),
('ShieldCheck','Intégrité','Transparence, confidentialité et respect des engagements pris.',3),
('HeartHandshake','Responsabilité sociale','Un impact concret pour les petits producteurs et les communautés rurales.',4);

INSERT INTO public.projects (tag,title,description,points,sort_order) VALUES
('Produit phare','Outil A-CAT digitalisé','L''Outil d''Analyse des Crédits Agricoles, digitalisé et déployé auprès des institutions de microfinance : analyse structurée des activités agricoles, des besoins de financement et de la capacité de remboursement.','{"Analyse des demandes plus rapide","Structuration des données des exploitations","Appui à la décision des agents de crédit"}',1),
('2017 – 2019','Projet MAVC — ICCO Coopération','Nos agronomes, sous l''appellation « Agri-Champions », ont accompagné les producteurs, identifié les contraintes des exploitations et appuyé les acteurs des chaînes de valeur.','{"Accompagnement des producteurs","Appui aux chaînes de valeur","Approches adaptées au secteur agricole"}',2),
('2022 – 2026','Projet PADFIR — Cordaid Burundi-RDC','Sous l''appellation « Agro-Routeurs », l''équipe a professionnalisé le financement agricole et rapproché les institutions de microfinance des producteurs.','{"Prototypes de produits financiers par filière","Renforcement des capacités des agents de crédit","Sensibilisation de nouveaux bénéficiaires"}',3),
('Approche','Financement « rayonnante » & assurance agricole','Un système organisant les petits producteurs autour d''un multiplicateur de semences, complété par l''intégration de l''assurance agricole en collaboration avec Inkinzo Assurance.','{"Organisation des petits producteurs","Calendriers de financement adaptés","Assurance agricole avec Inkinzo"}',4);

INSERT INTO public.achievements (label,sort_order) VALUES
('Augmentation du portefeuille de clients et de crédits des IMF partenaires',1),
('Amélioration de la qualité et de la rapidité de l''analyse des crédits agricoles',2),
('Meilleure présence et visibilité des IMF dans les zones rurales',3),
('Mise en place de manuels de gestion des crédits agricoles',4),
('Appropriation progressive de l''outil digital par les agents et cadres',5),
('Premières expériences d''assurance agricole liée au financement',6);

INSERT INTO public.partners (name,category,sort_order) VALUES
('CECM','IMF',1),('UCODE','IMF',2),('ISHAKA','IMF',3),('Hauge Family Microfinance','IMF',4),
('DIFO','IMF',5),('CORILAC','IMF',6),('CDEC','IMF',7),('RECECA INKINGI','IMF',8),
('MECI','IMF',9),('TUJANE','IMF',10),('WISE','IMF',11),('TWITEZIMBERE MF','IMF',12),
('Cordaid','Organisation internationale',13),('ICCO Coopération','Organisation internationale',14),
('Inkinzo Assurance','Assurance',15);

INSERT INTO public.team_members (name,role,email,description,icon,category,sort_order) VALUES
('Prof. Dr Emmanuel MIKEREGO','Directeur Général','emmanuel.mikerego@poly-solutions.bi','','Building2','direction',1),
('Prof. Jérémie NDIKUMAGENGE','Chef de projet',NULL,'','Building2','direction',2),
('Msc-Ir Didace NDAYISHIMIYE','Développeur Full Stack',NULL,'','Code2','direction',3),
('Msc-Ir Vercus NTIRANDEKURA','Analyste Développeur',NULL,'','Code2','direction',4),
('Économistes','Pôle économique',NULL,'Analyse économique et financière des activités, analyse des besoins de financement, gestion des crédits agricoles et accompagnement des institutions de microfinance.','Building2','pole',1),
('Agronomes','Pôle agronomique',NULL,'Identification des filières, étude des cycles de production, accompagnement des producteurs sur le terrain et suivi de l''utilisation des crédits agricoles.','Sprout','pole',2),
('Informaticiens','Pôle informatique',NULL,'Développement et digitalisation des outils d''analyse, déploiement de l''A-CAT, maintenance des solutions et appui aux utilisateurs.','Code2','pole',3);

INSERT INTO public.news_posts (slug,title,excerpt,body,is_published,published_at) VALUES
('lancement-site-officiel','Lancement du site officiel de POLY-SOLUTIONS SPRL','Notre nouvelle vitrine numérique présente nos services, nos réalisations et notre réseau de partenaires.','POLY-SOLUTIONS SPRL met en ligne son site officiel. Vous y trouverez la présentation de la société, nos quatre pôles d''expertise, nos réalisations de terrain — dont l''outil A-CAT — ainsi qu''un formulaire pour demander une démonstration ou un devis.',true,now()),
('acat-deploiement-imf','L''outil A-CAT poursuit son déploiement auprès des IMF','L''Outil d''Analyse des Crédits Agricoles digitalisé est progressivement adopté par les agents de crédit.','L''A-CAT structure l''analyse des activités agricoles, des besoins de financement et de la capacité de remboursement. Son déploiement s''accompagne de sessions de formation des agents de crédit et des cadres des institutions partenaires.',true,now() - interval '20 days');
