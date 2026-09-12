-- Gestionnaires (role "editor") can manage site content, but not administrators.
CREATE POLICY "editors write services" ON public.services FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "editors write values" ON public.core_values FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "editors write projects" ON public.projects FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "editors write achievements" ON public.achievements FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "editors write partners" ON public.partners FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "editors write team" ON public.team_members FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "editors write settings" ON public.site_settings FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "editors write news" ON public.news_posts FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "editors read all news" ON public.news_posts FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'editor'::app_role));

-- Gestionnaires can read and mark contact messages, but not delete them.
CREATE POLICY "editors read messages" ON public.contact_messages FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "editors update messages" ON public.contact_messages FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'editor'::app_role)) WITH CHECK (has_role(auth.uid(), 'editor'::app_role));

-- Lecteurs (role "user") can read received messages without changing them.
CREATE POLICY "readers read messages" ON public.contact_messages FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'user'::app_role));

CREATE POLICY "readers read all news" ON public.news_posts FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'user'::app_role));