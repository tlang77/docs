-- Add PostGIS geography column for spatial queries
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS location geography(Point, 4326);
UPDATE "Property" SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326);
CREATE INDEX IF NOT EXISTS property_location_idx ON "Property" USING GIST (location);
