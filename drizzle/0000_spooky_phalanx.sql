CREATE TABLE "items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"quantity" integer,
	"description" text,
	"location_id" uuid
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"parent_location_id" uuid
);
--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_parent_location_id_locations_id_fk" FOREIGN KEY ("parent_location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;