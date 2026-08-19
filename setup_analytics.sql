-- 1. Create the analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    path TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- Anyone (even anonymous) can insert events (track visits)
CREATE POLICY "Tout le monde peut inserer des events analytiques" 
ON public.analytics_events
FOR INSERT WITH CHECK (true);

-- Only admins can read analytics data
CREATE POLICY "Seuls les admins voient les statistiques" 
ON public.analytics_events
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Only admins can delete analytics data (cleanup)
CREATE POLICY "Seuls les admins peuvent supprimer les statistiques" 
ON public.analytics_events
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);
