-- Active: 1698655199073@@dpg-ckue2c237rbc73fkhssg-a.singapore-postgres.render.com@5432@nha_gia_re_postgres_yef0@public
    SELECT * FROM pg_extension WHERE extname = 'unaccent';

    CREATE EXTENSION unaccent;

    ALTER Table real_estate_posts ADD COLUMN document tsvector;

    UPDATE real_estate_posts
    SET document = (
        to_tsvector('simple', unaccent(title)) ||
        to_tsvector('simple', unaccent(description))
    );

    CREATE INDEX document_idx ON real_estate_posts USING GIN (document);

    --Trigger insert or update real_estate_posts
    CREATE OR REPLACE FUNCTION real_estate_posts_trigger() RETURNS trigger AS $$
    begin
        new.document :=
            setweight(to_tsvector('simple', unaccent(new.title)), 'A') ||
            setweight(to_tsvector('simple', unaccent(new.description)), 'B');
        return new;
    end
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE
    ON real_estate_posts FOR EACH ROW EXECUTE PROCEDURE real_estate_posts_trigger();

    --Query
WITH search_query AS (
    SELECT to_tsquery('simple', unaccent('thuê | nhà | thủ | đức')) AS query
)
SELECT id, title, description
FROM real_estate_posts
WHERE document @@ (SELECT query FROM search_query)
ORDER BY ts_rank(document, (SELECT query FROM search_query)) DESC;



SELECT
  ts_rank(
    to_tsvector('The quick brown fox jumped over the lazy dog'), 
    to_tsquery('fox')
  ) AS rank1,
  ts_rank(
    to_tsvector('The quick brown fox jumped over the lazy dog'), 
    to_tsquery('cat')
  ) AS rank2;

ALTER TABLE discount_codes
ADD COLUMN code VARCHAR(50) NOT NULL,
ADD CONSTRAINT code_unique UNIQUE (code);


-- Path: Full Text Search.sql
CREATE TABLE suggestion_keywords (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword VARCHAR(255) NOT NULL,
    keyword_vector tsvector NOT NULL,
    search_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITHOUt TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUt TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX suggestion_keywords_keyword_vector_idx ON suggestion_keywords USING GIN (keyword_vector);

CREATE OR REPLACE FUNCTION suggestion_keywords_trigger() RETURNS trigger AS $$

begin
    new.keyword_vector := to_tsvector('simple', unaccent(new.keyword));
    return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER suggestion_keywords_trigger BEFORE INSERT OR UPDATE
ON suggestion_keywords FOR EACH ROW EXECUTE PROCEDURE suggestion_keywords_trigger();

-- Delete TRIGGER
DROP TRIGGER suggestion_keywords_trigger ON suggestion_keywords;

-- Delete FUNCTION
DROP FUNCTION suggestion_keywords_trigger();

-- Delete TABLE
DROP TABLE suggestion_keywords;


INSERT INTO suggestion_keywords (keyword)
VALUES
  ('nhà trọ giá rẻ'),
  ('nhà trọ 2 tầng'),
  ('chung cư mini'),
  ('Đất mặt tiền quận 2'),
  ('Nhà 2 lầu 3 phòng ngủ'),
('Văn phòng cho thuê'),