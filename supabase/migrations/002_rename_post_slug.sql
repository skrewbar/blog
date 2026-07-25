-- Rename a post slug across all related tables in one transaction.
-- Usage (Supabase SQL editor or psql):
--   SELECT rename_post_slug('cf-1485B', 'cf-1485b');
-- Or via service_role RPC:
--   supabase.rpc('rename_post_slug', { p_old: 'cf-1485B', p_new: 'cf-1485b' })

CREATE OR REPLACE FUNCTION rename_post_slug(p_old TEXT, p_new TEXT)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
  v_old_views INTEGER := 0;
  v_old_exists BOOLEAN;
  v_new_exists BOOLEAN;
  v_comments INTEGER;
  v_likes INTEGER;
  v_view_logs INTEGER;
BEGIN
  IF p_old IS NULL OR btrim(p_old) = '' OR p_new IS NULL OR btrim(p_new) = '' THEN
    RAISE EXCEPTION 'old and new slug are required';
  END IF;

  IF p_old = p_new THEN
    RETURN json_build_object('renamed', FALSE, 'reason', 'same slug');
  END IF;

  -- Drop old likes that would collide with (slug, visitor_hash) unique constraint
  DELETE FROM likes AS old_like
  USING likes AS new_like
  WHERE old_like.slug = p_old
    AND new_like.slug = p_new
    AND old_like.visitor_hash = new_like.visitor_hash;

  UPDATE likes SET slug = p_new WHERE slug = p_old;
  GET DIAGNOSTICS v_likes = ROW_COUNT;

  UPDATE view_logs SET slug = p_new WHERE slug = p_old;
  GET DIAGNOSTICS v_view_logs = ROW_COUNT;

  UPDATE comments SET slug = p_new WHERE slug = p_old;
  GET DIAGNOSTICS v_comments = ROW_COUNT;

  SELECT EXISTS (SELECT 1 FROM post_stats WHERE slug = p_old) INTO v_old_exists;
  SELECT EXISTS (SELECT 1 FROM post_stats WHERE slug = p_new) INTO v_new_exists;

  IF v_old_exists THEN
    SELECT view_count INTO v_old_views FROM post_stats WHERE slug = p_old;

    IF v_new_exists THEN
      UPDATE post_stats
      SET
        view_count = post_stats.view_count + v_old_views,
        like_count = (SELECT COUNT(*)::INTEGER FROM likes WHERE slug = p_new),
        updated_at = NOW()
      WHERE slug = p_new;

      DELETE FROM post_stats WHERE slug = p_old;
    ELSE
      UPDATE post_stats
      SET
        slug = p_new,
        like_count = (SELECT COUNT(*)::INTEGER FROM likes WHERE slug = p_new),
        updated_at = NOW()
      WHERE slug = p_old;
    END IF;
  ELSIF v_new_exists THEN
    UPDATE post_stats
    SET
      like_count = (SELECT COUNT(*)::INTEGER FROM likes WHERE slug = p_new),
      updated_at = NOW()
    WHERE slug = p_new;
  END IF;

  RETURN json_build_object(
    'renamed', TRUE,
    'old_slug', p_old,
    'new_slug', p_new,
    'updated', json_build_object(
      'likes', v_likes,
      'view_logs', v_view_logs,
      'comments', v_comments
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.rename_post_slug(TEXT, TEXT) TO service_role;
