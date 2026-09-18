import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_intro_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__intro_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_course_overviews_level" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_course_overviews_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__course_overviews_v_version_level" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum__course_overviews_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_downloads_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__downloads_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_simulations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__simulations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_courses_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__courses_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_lessons_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lessons_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_course_resources_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__course_resources_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_exercises_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__exercises_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_quizzes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__quizzes_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "intro" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"subtitle" varchar,
  	"content" jsonb,
  	"cta_label" varchar,
  	"cta_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_intro_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_intro_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_subtitle" varchar,
  	"version_content" jsonb,
  	"version_cta_label" varchar,
  	"version_cta_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__intro_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "course_overviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"summary" varchar,
  	"content" jsonb,
  	"course_id" integer,
  	"level" "enum_course_overviews_level",
  	"duration_minutes" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_course_overviews_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_course_overviews_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_summary" varchar,
  	"version_content" jsonb,
  	"version_course_id" integer,
  	"version_level" "enum__course_overviews_v_version_level",
  	"version_duration_minutes" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__course_overviews_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "downloads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"description" varchar,
  	"download_url" varchar,
  	"format" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_downloads_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_downloads_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_description" varchar,
  	"version_download_url" varchar,
  	"version_format" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__downloads_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "simulations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"description" varchar,
  	"instructions" jsonb,
  	"simulation_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_simulations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_simulations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_description" varchar,
  	"version_instructions" jsonb,
  	"version_simulation_url" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__simulations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "courses_objectives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"objective" varchar
  );
  
  CREATE TABLE "courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"description" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_courses_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_courses_v_version_objectives" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"objective" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_courses_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_description" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__courses_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "lessons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"course_id" integer,
  	"content" jsonb,
  	"video_url" varchar,
  	"duration_minutes" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_lessons_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_lessons_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_course_id" integer,
  	"version_content" jsonb,
  	"version_video_url" varchar,
  	"version_duration_minutes" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__lessons_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "course_resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"course_id" integer,
  	"description" varchar,
  	"resource_url" varchar,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_course_resources_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_course_resources_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_course_id" integer,
  	"version_description" varchar,
  	"version_resource_url" varchar,
  	"version_content" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__course_resources_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "exercises" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"course_id" integer,
  	"prompt" jsonb,
  	"hint" jsonb,
  	"solution" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_exercises_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_exercises_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_course_id" integer,
  	"version_prompt" jsonb,
  	"version_hint" jsonb,
  	"version_solution" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__exercises_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "quizzes_questions_choices" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"is_correct" boolean DEFAULT false
  );
  
  CREATE TABLE "quizzes_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"prompt" varchar,
  	"explanation" jsonb
  );
  
  CREATE TABLE "quizzes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"course_id" integer,
  	"instructions" jsonb,
  	"passing_score" numeric DEFAULT 70,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_quizzes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_quizzes_v_version_questions_choices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"is_correct" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_quizzes_v_version_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"prompt" varchar,
  	"explanation" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_quizzes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_course_id" integer,
  	"version_instructions" jsonb,
  	"version_passing_score" numeric DEFAULT 70,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__quizzes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "intro_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "course_overviews_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "downloads_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "simulations_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "courses_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "lessons_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "course_resources_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "exercises_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "quizzes_id" integer;
  ALTER TABLE "_intro_v" ADD CONSTRAINT "_intro_v_parent_id_intro_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."intro"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "course_overviews" ADD CONSTRAINT "course_overviews_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_course_overviews_v" ADD CONSTRAINT "_course_overviews_v_parent_id_course_overviews_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."course_overviews"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_course_overviews_v" ADD CONSTRAINT "_course_overviews_v_version_course_id_courses_id_fk" FOREIGN KEY ("version_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_downloads_v" ADD CONSTRAINT "_downloads_v_parent_id_downloads_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."downloads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_simulations_v" ADD CONSTRAINT "_simulations_v_parent_id_simulations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."simulations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_objectives" ADD CONSTRAINT "courses_objectives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_version_objectives" ADD CONSTRAINT "_courses_v_version_objectives_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_parent_id_courses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lessons" ADD CONSTRAINT "lessons_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lessons_v" ADD CONSTRAINT "_lessons_v_parent_id_lessons_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lessons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lessons_v" ADD CONSTRAINT "_lessons_v_version_course_id_courses_id_fk" FOREIGN KEY ("version_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "course_resources" ADD CONSTRAINT "course_resources_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_course_resources_v" ADD CONSTRAINT "_course_resources_v_parent_id_course_resources_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."course_resources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_course_resources_v" ADD CONSTRAINT "_course_resources_v_version_course_id_courses_id_fk" FOREIGN KEY ("version_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exercises" ADD CONSTRAINT "exercises_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_exercises_v" ADD CONSTRAINT "_exercises_v_parent_id_exercises_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exercises"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_exercises_v" ADD CONSTRAINT "_exercises_v_version_course_id_courses_id_fk" FOREIGN KEY ("version_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "quizzes_questions_choices" ADD CONSTRAINT "quizzes_questions_choices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quizzes_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quizzes_questions" ADD CONSTRAINT "quizzes_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quizzes_v_version_questions_choices" ADD CONSTRAINT "_quizzes_v_version_questions_choices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quizzes_v_version_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quizzes_v_version_questions" ADD CONSTRAINT "_quizzes_v_version_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_quizzes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_quizzes_v" ADD CONSTRAINT "_quizzes_v_parent_id_quizzes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."quizzes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_quizzes_v" ADD CONSTRAINT "_quizzes_v_version_course_id_courses_id_fk" FOREIGN KEY ("version_course_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "intro_slug_idx" ON "intro" USING btree ("slug");
  CREATE INDEX "intro_updated_at_idx" ON "intro" USING btree ("updated_at");
  CREATE INDEX "intro_created_at_idx" ON "intro" USING btree ("created_at");
  CREATE INDEX "intro__status_idx" ON "intro" USING btree ("_status");
  CREATE INDEX "_intro_v_parent_idx" ON "_intro_v" USING btree ("parent_id");
  CREATE INDEX "_intro_v_version_version_slug_idx" ON "_intro_v" USING btree ("version_slug");
  CREATE INDEX "_intro_v_version_version_updated_at_idx" ON "_intro_v" USING btree ("version_updated_at");
  CREATE INDEX "_intro_v_version_version_created_at_idx" ON "_intro_v" USING btree ("version_created_at");
  CREATE INDEX "_intro_v_version_version__status_idx" ON "_intro_v" USING btree ("version__status");
  CREATE INDEX "_intro_v_created_at_idx" ON "_intro_v" USING btree ("created_at");
  CREATE INDEX "_intro_v_updated_at_idx" ON "_intro_v" USING btree ("updated_at");
  CREATE INDEX "_intro_v_latest_idx" ON "_intro_v" USING btree ("latest");
  CREATE UNIQUE INDEX "course_overviews_slug_idx" ON "course_overviews" USING btree ("slug");
  CREATE INDEX "course_overviews_course_idx" ON "course_overviews" USING btree ("course_id");
  CREATE INDEX "course_overviews_updated_at_idx" ON "course_overviews" USING btree ("updated_at");
  CREATE INDEX "course_overviews_created_at_idx" ON "course_overviews" USING btree ("created_at");
  CREATE INDEX "course_overviews__status_idx" ON "course_overviews" USING btree ("_status");
  CREATE INDEX "_course_overviews_v_parent_idx" ON "_course_overviews_v" USING btree ("parent_id");
  CREATE INDEX "_course_overviews_v_version_version_slug_idx" ON "_course_overviews_v" USING btree ("version_slug");
  CREATE INDEX "_course_overviews_v_version_version_course_idx" ON "_course_overviews_v" USING btree ("version_course_id");
  CREATE INDEX "_course_overviews_v_version_version_updated_at_idx" ON "_course_overviews_v" USING btree ("version_updated_at");
  CREATE INDEX "_course_overviews_v_version_version_created_at_idx" ON "_course_overviews_v" USING btree ("version_created_at");
  CREATE INDEX "_course_overviews_v_version_version__status_idx" ON "_course_overviews_v" USING btree ("version__status");
  CREATE INDEX "_course_overviews_v_created_at_idx" ON "_course_overviews_v" USING btree ("created_at");
  CREATE INDEX "_course_overviews_v_updated_at_idx" ON "_course_overviews_v" USING btree ("updated_at");
  CREATE INDEX "_course_overviews_v_latest_idx" ON "_course_overviews_v" USING btree ("latest");
  CREATE UNIQUE INDEX "downloads_slug_idx" ON "downloads" USING btree ("slug");
  CREATE INDEX "downloads_updated_at_idx" ON "downloads" USING btree ("updated_at");
  CREATE INDEX "downloads_created_at_idx" ON "downloads" USING btree ("created_at");
  CREATE INDEX "downloads__status_idx" ON "downloads" USING btree ("_status");
  CREATE INDEX "_downloads_v_parent_idx" ON "_downloads_v" USING btree ("parent_id");
  CREATE INDEX "_downloads_v_version_version_slug_idx" ON "_downloads_v" USING btree ("version_slug");
  CREATE INDEX "_downloads_v_version_version_updated_at_idx" ON "_downloads_v" USING btree ("version_updated_at");
  CREATE INDEX "_downloads_v_version_version_created_at_idx" ON "_downloads_v" USING btree ("version_created_at");
  CREATE INDEX "_downloads_v_version_version__status_idx" ON "_downloads_v" USING btree ("version__status");
  CREATE INDEX "_downloads_v_created_at_idx" ON "_downloads_v" USING btree ("created_at");
  CREATE INDEX "_downloads_v_updated_at_idx" ON "_downloads_v" USING btree ("updated_at");
  CREATE INDEX "_downloads_v_latest_idx" ON "_downloads_v" USING btree ("latest");
  CREATE UNIQUE INDEX "simulations_slug_idx" ON "simulations" USING btree ("slug");
  CREATE INDEX "simulations_updated_at_idx" ON "simulations" USING btree ("updated_at");
  CREATE INDEX "simulations_created_at_idx" ON "simulations" USING btree ("created_at");
  CREATE INDEX "simulations__status_idx" ON "simulations" USING btree ("_status");
  CREATE INDEX "_simulations_v_parent_idx" ON "_simulations_v" USING btree ("parent_id");
  CREATE INDEX "_simulations_v_version_version_slug_idx" ON "_simulations_v" USING btree ("version_slug");
  CREATE INDEX "_simulations_v_version_version_updated_at_idx" ON "_simulations_v" USING btree ("version_updated_at");
  CREATE INDEX "_simulations_v_version_version_created_at_idx" ON "_simulations_v" USING btree ("version_created_at");
  CREATE INDEX "_simulations_v_version_version__status_idx" ON "_simulations_v" USING btree ("version__status");
  CREATE INDEX "_simulations_v_created_at_idx" ON "_simulations_v" USING btree ("created_at");
  CREATE INDEX "_simulations_v_updated_at_idx" ON "_simulations_v" USING btree ("updated_at");
  CREATE INDEX "_simulations_v_latest_idx" ON "_simulations_v" USING btree ("latest");
  CREATE INDEX "courses_objectives_order_idx" ON "courses_objectives" USING btree ("_order");
  CREATE INDEX "courses_objectives_parent_id_idx" ON "courses_objectives" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");
  CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE INDEX "courses__status_idx" ON "courses" USING btree ("_status");
  CREATE INDEX "_courses_v_version_objectives_order_idx" ON "_courses_v_version_objectives" USING btree ("_order");
  CREATE INDEX "_courses_v_version_objectives_parent_id_idx" ON "_courses_v_version_objectives" USING btree ("_parent_id");
  CREATE INDEX "_courses_v_parent_idx" ON "_courses_v" USING btree ("parent_id");
  CREATE INDEX "_courses_v_version_version_slug_idx" ON "_courses_v" USING btree ("version_slug");
  CREATE INDEX "_courses_v_version_version_updated_at_idx" ON "_courses_v" USING btree ("version_updated_at");
  CREATE INDEX "_courses_v_version_version_created_at_idx" ON "_courses_v" USING btree ("version_created_at");
  CREATE INDEX "_courses_v_version_version__status_idx" ON "_courses_v" USING btree ("version__status");
  CREATE INDEX "_courses_v_created_at_idx" ON "_courses_v" USING btree ("created_at");
  CREATE INDEX "_courses_v_updated_at_idx" ON "_courses_v" USING btree ("updated_at");
  CREATE INDEX "_courses_v_latest_idx" ON "_courses_v" USING btree ("latest");
  CREATE UNIQUE INDEX "lessons_slug_idx" ON "lessons" USING btree ("slug");
  CREATE INDEX "lessons_course_idx" ON "lessons" USING btree ("course_id");
  CREATE INDEX "lessons_updated_at_idx" ON "lessons" USING btree ("updated_at");
  CREATE INDEX "lessons_created_at_idx" ON "lessons" USING btree ("created_at");
  CREATE INDEX "lessons__status_idx" ON "lessons" USING btree ("_status");
  CREATE INDEX "_lessons_v_parent_idx" ON "_lessons_v" USING btree ("parent_id");
  CREATE INDEX "_lessons_v_version_version_slug_idx" ON "_lessons_v" USING btree ("version_slug");
  CREATE INDEX "_lessons_v_version_version_course_idx" ON "_lessons_v" USING btree ("version_course_id");
  CREATE INDEX "_lessons_v_version_version_updated_at_idx" ON "_lessons_v" USING btree ("version_updated_at");
  CREATE INDEX "_lessons_v_version_version_created_at_idx" ON "_lessons_v" USING btree ("version_created_at");
  CREATE INDEX "_lessons_v_version_version__status_idx" ON "_lessons_v" USING btree ("version__status");
  CREATE INDEX "_lessons_v_created_at_idx" ON "_lessons_v" USING btree ("created_at");
  CREATE INDEX "_lessons_v_updated_at_idx" ON "_lessons_v" USING btree ("updated_at");
  CREATE INDEX "_lessons_v_latest_idx" ON "_lessons_v" USING btree ("latest");
  CREATE UNIQUE INDEX "course_resources_slug_idx" ON "course_resources" USING btree ("slug");
  CREATE INDEX "course_resources_course_idx" ON "course_resources" USING btree ("course_id");
  CREATE INDEX "course_resources_updated_at_idx" ON "course_resources" USING btree ("updated_at");
  CREATE INDEX "course_resources_created_at_idx" ON "course_resources" USING btree ("created_at");
  CREATE INDEX "course_resources__status_idx" ON "course_resources" USING btree ("_status");
  CREATE INDEX "_course_resources_v_parent_idx" ON "_course_resources_v" USING btree ("parent_id");
  CREATE INDEX "_course_resources_v_version_version_slug_idx" ON "_course_resources_v" USING btree ("version_slug");
  CREATE INDEX "_course_resources_v_version_version_course_idx" ON "_course_resources_v" USING btree ("version_course_id");
  CREATE INDEX "_course_resources_v_version_version_updated_at_idx" ON "_course_resources_v" USING btree ("version_updated_at");
  CREATE INDEX "_course_resources_v_version_version_created_at_idx" ON "_course_resources_v" USING btree ("version_created_at");
  CREATE INDEX "_course_resources_v_version_version__status_idx" ON "_course_resources_v" USING btree ("version__status");
  CREATE INDEX "_course_resources_v_created_at_idx" ON "_course_resources_v" USING btree ("created_at");
  CREATE INDEX "_course_resources_v_updated_at_idx" ON "_course_resources_v" USING btree ("updated_at");
  CREATE INDEX "_course_resources_v_latest_idx" ON "_course_resources_v" USING btree ("latest");
  CREATE UNIQUE INDEX "exercises_slug_idx" ON "exercises" USING btree ("slug");
  CREATE INDEX "exercises_course_idx" ON "exercises" USING btree ("course_id");
  CREATE INDEX "exercises_updated_at_idx" ON "exercises" USING btree ("updated_at");
  CREATE INDEX "exercises_created_at_idx" ON "exercises" USING btree ("created_at");
  CREATE INDEX "exercises__status_idx" ON "exercises" USING btree ("_status");
  CREATE INDEX "_exercises_v_parent_idx" ON "_exercises_v" USING btree ("parent_id");
  CREATE INDEX "_exercises_v_version_version_slug_idx" ON "_exercises_v" USING btree ("version_slug");
  CREATE INDEX "_exercises_v_version_version_course_idx" ON "_exercises_v" USING btree ("version_course_id");
  CREATE INDEX "_exercises_v_version_version_updated_at_idx" ON "_exercises_v" USING btree ("version_updated_at");
  CREATE INDEX "_exercises_v_version_version_created_at_idx" ON "_exercises_v" USING btree ("version_created_at");
  CREATE INDEX "_exercises_v_version_version__status_idx" ON "_exercises_v" USING btree ("version__status");
  CREATE INDEX "_exercises_v_created_at_idx" ON "_exercises_v" USING btree ("created_at");
  CREATE INDEX "_exercises_v_updated_at_idx" ON "_exercises_v" USING btree ("updated_at");
  CREATE INDEX "_exercises_v_latest_idx" ON "_exercises_v" USING btree ("latest");
  CREATE INDEX "quizzes_questions_choices_order_idx" ON "quizzes_questions_choices" USING btree ("_order");
  CREATE INDEX "quizzes_questions_choices_parent_id_idx" ON "quizzes_questions_choices" USING btree ("_parent_id");
  CREATE INDEX "quizzes_questions_order_idx" ON "quizzes_questions" USING btree ("_order");
  CREATE INDEX "quizzes_questions_parent_id_idx" ON "quizzes_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "quizzes_slug_idx" ON "quizzes" USING btree ("slug");
  CREATE INDEX "quizzes_course_idx" ON "quizzes" USING btree ("course_id");
  CREATE INDEX "quizzes_updated_at_idx" ON "quizzes" USING btree ("updated_at");
  CREATE INDEX "quizzes_created_at_idx" ON "quizzes" USING btree ("created_at");
  CREATE INDEX "quizzes__status_idx" ON "quizzes" USING btree ("_status");
  CREATE INDEX "_quizzes_v_version_questions_choices_order_idx" ON "_quizzes_v_version_questions_choices" USING btree ("_order");
  CREATE INDEX "_quizzes_v_version_questions_choices_parent_id_idx" ON "_quizzes_v_version_questions_choices" USING btree ("_parent_id");
  CREATE INDEX "_quizzes_v_version_questions_order_idx" ON "_quizzes_v_version_questions" USING btree ("_order");
  CREATE INDEX "_quizzes_v_version_questions_parent_id_idx" ON "_quizzes_v_version_questions" USING btree ("_parent_id");
  CREATE INDEX "_quizzes_v_parent_idx" ON "_quizzes_v" USING btree ("parent_id");
  CREATE INDEX "_quizzes_v_version_version_slug_idx" ON "_quizzes_v" USING btree ("version_slug");
  CREATE INDEX "_quizzes_v_version_version_course_idx" ON "_quizzes_v" USING btree ("version_course_id");
  CREATE INDEX "_quizzes_v_version_version_updated_at_idx" ON "_quizzes_v" USING btree ("version_updated_at");
  CREATE INDEX "_quizzes_v_version_version_created_at_idx" ON "_quizzes_v" USING btree ("version_created_at");
  CREATE INDEX "_quizzes_v_version_version__status_idx" ON "_quizzes_v" USING btree ("version__status");
  CREATE INDEX "_quizzes_v_created_at_idx" ON "_quizzes_v" USING btree ("created_at");
  CREATE INDEX "_quizzes_v_updated_at_idx" ON "_quizzes_v" USING btree ("updated_at");
  CREATE INDEX "_quizzes_v_latest_idx" ON "_quizzes_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_intro_fk" FOREIGN KEY ("intro_id") REFERENCES "public"."intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_course_overviews_fk" FOREIGN KEY ("course_overviews_id") REFERENCES "public"."course_overviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_downloads_fk" FOREIGN KEY ("downloads_id") REFERENCES "public"."downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_simulations_fk" FOREIGN KEY ("simulations_id") REFERENCES "public"."simulations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lessons_fk" FOREIGN KEY ("lessons_id") REFERENCES "public"."lessons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_course_resources_fk" FOREIGN KEY ("course_resources_id") REFERENCES "public"."course_resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exercises_fk" FOREIGN KEY ("exercises_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_quizzes_fk" FOREIGN KEY ("quizzes_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_intro_id_idx" ON "payload_locked_documents_rels" USING btree ("intro_id");
  CREATE INDEX "payload_locked_documents_rels_course_overviews_id_idx" ON "payload_locked_documents_rels" USING btree ("course_overviews_id");
  CREATE INDEX "payload_locked_documents_rels_downloads_id_idx" ON "payload_locked_documents_rels" USING btree ("downloads_id");
  CREATE INDEX "payload_locked_documents_rels_simulations_id_idx" ON "payload_locked_documents_rels" USING btree ("simulations_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_locked_documents_rels_lessons_id_idx" ON "payload_locked_documents_rels" USING btree ("lessons_id");
  CREATE INDEX "payload_locked_documents_rels_course_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("course_resources_id");
  CREATE INDEX "payload_locked_documents_rels_exercises_id_idx" ON "payload_locked_documents_rels" USING btree ("exercises_id");
  CREATE INDEX "payload_locked_documents_rels_quizzes_id_idx" ON "payload_locked_documents_rels" USING btree ("quizzes_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_intro_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "course_overviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_course_overviews_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "downloads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_downloads_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "simulations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_simulations_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "courses_objectives" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "courses" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_courses_v_version_objectives" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_courses_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lessons" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_lessons_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "course_resources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_course_resources_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "exercises" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_exercises_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "quizzes_questions_choices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "quizzes_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "quizzes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_quizzes_v_version_questions_choices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_quizzes_v_version_questions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_quizzes_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "intro" CASCADE;
  DROP TABLE "_intro_v" CASCADE;
  DROP TABLE "course_overviews" CASCADE;
  DROP TABLE "_course_overviews_v" CASCADE;
  DROP TABLE "downloads" CASCADE;
  DROP TABLE "_downloads_v" CASCADE;
  DROP TABLE "simulations" CASCADE;
  DROP TABLE "_simulations_v" CASCADE;
  DROP TABLE "courses_objectives" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "_courses_v_version_objectives" CASCADE;
  DROP TABLE "_courses_v" CASCADE;
  DROP TABLE "lessons" CASCADE;
  DROP TABLE "_lessons_v" CASCADE;
  DROP TABLE "course_resources" CASCADE;
  DROP TABLE "_course_resources_v" CASCADE;
  DROP TABLE "exercises" CASCADE;
  DROP TABLE "_exercises_v" CASCADE;
  DROP TABLE "quizzes_questions_choices" CASCADE;
  DROP TABLE "quizzes_questions" CASCADE;
  DROP TABLE "quizzes" CASCADE;
  DROP TABLE "_quizzes_v_version_questions_choices" CASCADE;
  DROP TABLE "_quizzes_v_version_questions" CASCADE;
  DROP TABLE "_quizzes_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_intro_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_course_overviews_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_downloads_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_simulations_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_courses_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_lessons_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_course_resources_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_exercises_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_quizzes_fk";
  
  DROP INDEX "payload_locked_documents_rels_intro_id_idx";
  DROP INDEX "payload_locked_documents_rels_course_overviews_id_idx";
  DROP INDEX "payload_locked_documents_rels_downloads_id_idx";
  DROP INDEX "payload_locked_documents_rels_simulations_id_idx";
  DROP INDEX "payload_locked_documents_rels_courses_id_idx";
  DROP INDEX "payload_locked_documents_rels_lessons_id_idx";
  DROP INDEX "payload_locked_documents_rels_course_resources_id_idx";
  DROP INDEX "payload_locked_documents_rels_exercises_id_idx";
  DROP INDEX "payload_locked_documents_rels_quizzes_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "intro_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "course_overviews_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "downloads_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "simulations_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "courses_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "lessons_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "course_resources_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "exercises_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "quizzes_id";
  DROP TYPE "public"."enum_intro_status";
  DROP TYPE "public"."enum__intro_v_version_status";
  DROP TYPE "public"."enum_course_overviews_level";
  DROP TYPE "public"."enum_course_overviews_status";
  DROP TYPE "public"."enum__course_overviews_v_version_level";
  DROP TYPE "public"."enum__course_overviews_v_version_status";
  DROP TYPE "public"."enum_downloads_status";
  DROP TYPE "public"."enum__downloads_v_version_status";
  DROP TYPE "public"."enum_simulations_status";
  DROP TYPE "public"."enum__simulations_v_version_status";
  DROP TYPE "public"."enum_courses_status";
  DROP TYPE "public"."enum__courses_v_version_status";
  DROP TYPE "public"."enum_lessons_status";
  DROP TYPE "public"."enum__lessons_v_version_status";
  DROP TYPE "public"."enum_course_resources_status";
  DROP TYPE "public"."enum__course_resources_v_version_status";
  DROP TYPE "public"."enum_exercises_status";
  DROP TYPE "public"."enum__exercises_v_version_status";
  DROP TYPE "public"."enum_quizzes_status";
  DROP TYPE "public"."enum__quizzes_v_version_status";`)
}
