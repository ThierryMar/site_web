import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload_mcp_api_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"user_id" integer NOT NULL,
  	"label" varchar,
  	"description" varchar,
  	"pages_find" boolean DEFAULT false,
  	"pages_create" boolean DEFAULT false,
  	"pages_update" boolean DEFAULT false,
  	"pages_delete" boolean DEFAULT false,
  	"intro_find" boolean DEFAULT false,
  	"intro_create" boolean DEFAULT false,
  	"intro_update" boolean DEFAULT false,
  	"intro_delete" boolean DEFAULT false,
  	"course_overviews_find" boolean DEFAULT false,
  	"course_overviews_create" boolean DEFAULT false,
  	"course_overviews_update" boolean DEFAULT false,
  	"course_overviews_delete" boolean DEFAULT false,
  	"downloads_find" boolean DEFAULT false,
  	"downloads_create" boolean DEFAULT false,
  	"downloads_update" boolean DEFAULT false,
  	"downloads_delete" boolean DEFAULT false,
  	"simulations_find" boolean DEFAULT false,
  	"simulations_create" boolean DEFAULT false,
  	"simulations_update" boolean DEFAULT false,
  	"simulations_delete" boolean DEFAULT false,
  	"courses_find" boolean DEFAULT false,
  	"courses_create" boolean DEFAULT false,
  	"courses_update" boolean DEFAULT false,
  	"courses_delete" boolean DEFAULT false,
  	"lessons_find" boolean DEFAULT false,
  	"lessons_create" boolean DEFAULT false,
  	"lessons_update" boolean DEFAULT false,
  	"lessons_delete" boolean DEFAULT false,
  	"course_resources_find" boolean DEFAULT false,
  	"course_resources_create" boolean DEFAULT false,
  	"course_resources_update" boolean DEFAULT false,
  	"course_resources_delete" boolean DEFAULT false,
  	"exercises_find" boolean DEFAULT false,
  	"exercises_create" boolean DEFAULT false,
  	"exercises_update" boolean DEFAULT false,
  	"exercises_delete" boolean DEFAULT false,
  	"quizzes_find" boolean DEFAULT false,
  	"quizzes_create" boolean DEFAULT false,
  	"quizzes_update" boolean DEFAULT false,
  	"quizzes_delete" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_mcp_api_keys_id" integer;
  ALTER TABLE "payload_preferences_rels" ADD COLUMN "payload_mcp_api_keys_id" integer;
  ALTER TABLE "payload_mcp_api_keys" ADD CONSTRAINT "payload_mcp_api_keys_user_id_admins_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admins"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_mcp_api_keys_user_idx" ON "payload_mcp_api_keys" USING btree ("user_id");
  CREATE INDEX "payload_mcp_api_keys_updated_at_idx" ON "payload_mcp_api_keys" USING btree ("updated_at");
  CREATE INDEX "payload_mcp_api_keys_created_at_idx" ON "payload_mcp_api_keys" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk" FOREIGN KEY ("payload_mcp_api_keys_id") REFERENCES "public"."payload_mcp_api_keys"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_payload_mcp_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_mcp_api_keys_id");
  CREATE INDEX "payload_preferences_rels_payload_mcp_api_keys_id_idx" ON "payload_preferences_rels" USING btree ("payload_mcp_api_keys_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_mcp_api_keys" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_mcp_api_keys_fk";
  
  ALTER TABLE "payload_preferences_rels" DROP CONSTRAINT "payload_preferences_rels_payload_mcp_api_keys_fk";
  
  DROP INDEX "payload_locked_documents_rels_payload_mcp_api_keys_id_idx";
  DROP INDEX "payload_preferences_rels_payload_mcp_api_keys_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_mcp_api_keys_id";
  ALTER TABLE "payload_preferences_rels" DROP COLUMN "payload_mcp_api_keys_id";
  DROP TABLE "payload_mcp_api_keys";`)
}
