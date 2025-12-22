CREATE OR REPLACE FUNCTION limit_files()
RETURNS TRIGGER AS $$
DECLARE
    row_count INTEGER;
    max_rows INTEGER := 3;
BEGIN
    SELECT COUNT(*) INTO row_count FROM file;
    IF row_count > max_rows THEN
        DELETE FROM file
        WHERE id IN (
            SELECT id
            FROM file
            ORDER BY created_at ASC
            LIMIT (row_count - max_rows)
        );
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;