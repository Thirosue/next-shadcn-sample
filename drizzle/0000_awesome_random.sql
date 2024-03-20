DO $$ BEGIN
 CREATE TYPE "permissionTypeEnum" AS ENUM('screen', 'actions');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "roleEnum" AS ENUM('admin', 'user', 'operator');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"images" json DEFAULT 'null'::json,
	"category_id" varchar(30) NOT NULL,
	"subcategory_id" varchar(30),
	"price" numeric(10, 2) DEFAULT '0' NOT NULL,
	"inventory" integer DEFAULT 0 NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"tags" json DEFAULT 'null'::json,
	"store_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rolePermission" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"role" "roleEnum" NOT NULL,
	"type" "permissionTypeEnum" NOT NULL,
	"namespace" varchar(256),
	"operation" varchar(64),
	"pathname" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role" (
	"role" "roleEnum" PRIMARY KEY NOT NULL,
	"description" varchar(256),
	"base_url" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stores" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(36),
	"name" varchar NOT NULL,
	"description" text,
	"slug" text,
	"active" boolean DEFAULT false NOT NULL,
	"stripe_account_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "stores_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subcategories" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"description" text,
	"category_id" varchar(30) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT current_timestamp,
	CONSTRAINT "subcategories_name_unique" UNIQUE("name"),
	CONSTRAINT "subcategories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "systemUser" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "roleEnum" NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_store_id_idx" ON "products" ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_category_id_idx" ON "products" ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_subcategory_id_idx" ON "products" ("subcategory_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subcategories_category_id_idx" ON "subcategories" ("category_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "subcategories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rolePermission" ADD CONSTRAINT "rolePermission_role_role_role_fk" FOREIGN KEY ("role") REFERENCES "role"("role") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
