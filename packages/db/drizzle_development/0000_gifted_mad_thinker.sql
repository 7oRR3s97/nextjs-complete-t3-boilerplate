DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('user', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nextjs_boilerplate_development_account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "nextjs_boilerplate_development_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nextjs_boilerplate_development_passwordResetToken" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "nextjs_boilerplate_development_passwordResetToken_email_token_pk" PRIMARY KEY("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nextjs_boilerplate_development_session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nextjs_boilerplate_development_twoFactorConfirmation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nextjs_boilerplate_development_twoFactorToken" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "nextjs_boilerplate_development_twoFactorToken_email_token_pk" PRIMARY KEY("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nextjs_boilerplate_development_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text,
	"emailVerified" timestamp,
	"image" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"isTwoFactorEnabled" boolean DEFAULT false NOT NULL,
	"stripeCustomerId" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nextjs_boilerplate_development_verificationToken" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "nextjs_boilerplate_development_verificationToken_email_token_pk" PRIMARY KEY("email","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nextjs_boilerplate_development_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"author_id" uuid NOT NULL,
	"name" varchar(256) NOT NULL,
	"content" varchar(256) NOT NULL,
	"cover_image_url" varchar(256),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nextjs_boilerplate_development_account" ADD CONSTRAINT "nextjs_boilerplate_development_account_userId_nextjs_boilerplate_development_user_id_fk" FOREIGN KEY ("userId") REFERENCES "nextjs_boilerplate_development_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nextjs_boilerplate_development_session" ADD CONSTRAINT "nextjs_boilerplate_development_session_userId_nextjs_boilerplate_development_user_id_fk" FOREIGN KEY ("userId") REFERENCES "nextjs_boilerplate_development_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nextjs_boilerplate_development_twoFactorConfirmation" ADD CONSTRAINT "nextjs_boilerplate_development_twoFactorConfirmation_userId_nextjs_boilerplate_development_user_id_fk" FOREIGN KEY ("userId") REFERENCES "nextjs_boilerplate_development_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "nextjs_boilerplate_development_post" ADD CONSTRAINT "nextjs_boilerplate_development_post_author_id_nextjs_boilerplate_development_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "nextjs_boilerplate_development_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
