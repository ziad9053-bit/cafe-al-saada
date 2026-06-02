-- شغّل هذا في Supabase → SQL Editor (مرة واحدة)
-- لدعم مؤقت التجهيز في لوحة العامل

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS preparing_started_at timestamptz;
