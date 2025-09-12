-- 003_add_user_preferred_category.sql
USE linguaforge;

ALTER TABLE users
  ADD COLUMN preferred_category VARCHAR(50) NULL AFTER coins;


