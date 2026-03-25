CREATE TABLE "payment_transactions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "transaction_id" varchar(255) NOT NULL,
  "provider" varchar(50) DEFAULT 'bakong' NOT NULL,
  "provider_status" varchar(50),
  "status" varchar(50) DEFAULT 'pending' NOT NULL,
  "user_id" uuid,
  "vendor_id" uuid,
  "plan_code" varchar(50) NOT NULL,
  "billing_cycle" varchar(20) NOT NULL,
  "method" varchar(20) NOT NULL,
  "amount" numeric(10, 2) NOT NULL,
  "currency" varchar(10) NOT NULL,
  "description" text,
  "qr_string" text,
  "webhook_payload" jsonb,
  "completed_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "payment_transactions_transaction_id_unique" UNIQUE("transaction_id")
);
--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE set null ON UPDATE no action;
