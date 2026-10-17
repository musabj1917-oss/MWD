CREATE TABLE "images" (
	"id" text PRIMARY KEY NOT NULL,
	"filename" text,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"data" "bytea" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inquiry_attachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"inquiry_id" integer NOT NULL,
	"filename" text,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"data" "bytea" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_processed_updates" (
	"update_id" text PRIMARY KEY NOT NULL,
	"processed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "telegram_sessions" (
	"chat_id" text PRIMARY KEY NOT NULL,
	"step" text DEFAULT 'idle' NOT NULL,
	"data" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "telegram" text;--> statement-breakpoint
ALTER TABLE "inquiries" ADD COLUMN "timeline" text;--> statement-breakpoint
ALTER TABLE "portfolio_projects" ADD COLUMN "gallery" text[];--> statement-breakpoint
ALTER TABLE "inquiry_attachments" ADD CONSTRAINT "inquiry_attachments_inquiry_id_inquiries_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiries"("id") ON DELETE cascade ON UPDATE no action;