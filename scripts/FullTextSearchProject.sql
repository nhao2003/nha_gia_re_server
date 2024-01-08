ALTER Table projects ADD COLUMN document tsvector;

UPDATE projects
SET
    document = (
        to_tsvector(
            'simple',
            unaccent(project_name)
        )
    );

CREATE INDEX document_idx ON projects USING GIN (document);

--Trigger insert or update projects
CREATE OR REPLACE FUNCTION projects_trigger() RETURNS trigger AS $$
begin
    new.document :=
        setweight(to_tsvector('simple', unaccent(new.project_name)), 'A');
    return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE

ON projects FOR EACH ROW EXECUTE PROCEDURE projects_trigger();