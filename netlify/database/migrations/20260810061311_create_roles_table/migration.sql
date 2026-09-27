CREATE TABLE "roles" (
	"id" serial PRIMARY KEY,
	"slug" text NOT NULL UNIQUE,
	"title" text NOT NULL,
	"hook" text NOT NULL,
	"description" text NOT NULL,
	"tasks" jsonb DEFAULT '[]' NOT NULL,
	"skills" jsonb DEFAULT '[]' NOT NULL,
	"roadmap" jsonb DEFAULT '[]' NOT NULL,
	"broll_tags" jsonb DEFAULT '[]' NOT NULL,
	"cta" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
