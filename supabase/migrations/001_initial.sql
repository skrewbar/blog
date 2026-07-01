-- Post statistics
CREATE TABLE IF NOT EXISTS post_stats (
  slug TEXT PRIMARY KEY,
  view_count INTEGER NOT NULL DEFAULT 0,
  like_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- View logs for 24h deduplication
CREATE TABLE IF NOT EXISTS view_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_view_logs_slug_visitor_created
  ON view_logs (slug, visitor_hash, created_at DESC);

-- Likes (one per visitor per post)
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  visitor_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (slug, visitor_hash)
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  gravatar_hash TEXT NOT NULL,
  body TEXT NOT NULL,
  notify BOOLEAN NOT NULL DEFAULT FALSE,
  unsubscribe_token TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  is_spam BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_slug_created
  ON comments (slug, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_comments_ip_created
  ON comments (ip_hash, created_at DESC);

-- Atomic view increment with 24h deduplication
CREATE OR REPLACE FUNCTION increment_view_count(
  p_slug TEXT,
  p_visitor_hash TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_exists BOOLEAN;
  v_count INTEGER;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM view_logs
    WHERE slug = p_slug
      AND visitor_hash = p_visitor_hash
      AND created_at > NOW() - INTERVAL '24 hours'
  ) INTO v_exists;

  IF v_exists THEN
    SELECT COALESCE(view_count, 0)
    INTO v_count
    FROM post_stats
    WHERE slug = p_slug;

    RETURN json_build_object(
      'view_count', COALESCE(v_count, 0),
      'incremented', FALSE
    );
  END IF;

  INSERT INTO view_logs (slug, visitor_hash)
  VALUES (p_slug, p_visitor_hash);

  INSERT INTO post_stats (slug, view_count, like_count)
  VALUES (p_slug, 1, 0)
  ON CONFLICT (slug)
  DO UPDATE SET
    view_count = post_stats.view_count + 1,
    updated_at = NOW()
  RETURNING view_count INTO v_count;

  RETURN json_build_object(
    'view_count', v_count,
    'incremented', TRUE
  );
END;
$$;

-- Atomic like increment (one per visitor)
CREATE OR REPLACE FUNCTION add_like(
  p_slug TEXT,
  p_visitor_hash TEXT
)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER;
  v_liked BOOLEAN := FALSE;
BEGIN
  BEGIN
    INSERT INTO likes (slug, visitor_hash)
    VALUES (p_slug, p_visitor_hash);

    INSERT INTO post_stats (slug, view_count, like_count)
    VALUES (p_slug, 0, 1)
    ON CONFLICT (slug)
    DO UPDATE SET
      like_count = post_stats.like_count + 1,
      updated_at = NOW()
    RETURNING like_count INTO v_count;

    v_liked := TRUE;
  EXCEPTION
    WHEN unique_violation THEN
      SELECT COALESCE(like_count, 0)
      INTO v_count
      FROM post_stats
      WHERE slug = p_slug;
  END;

  RETURN json_build_object(
    'like_count', COALESCE(v_count, 0),
    'liked', v_liked
  );
END;
$$;

-- Enable RLS
ALTER TABLE post_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- No public policies: all access via service role from server
