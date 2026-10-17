import { pgTable, text, timestamp, boolean, serial, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  image: text('image'),
  role: text('role').notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  published: boolean('published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  price: integer('price').notNull(),
  currency: text('currency').notNull().default('USD'),
  billingType: text('billing_type').notNull().default('one-time'),
  published: boolean('published').notNull().default(false),
  serviceId: integer('service_id').references(() => services.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const portfolioProjects = pgTable('portfolio_projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  summary: text('summary').notNull(),
  description: text('description').notNull(),
  category: text('category'),
  coverImage: text('cover_image'),
  projectUrl: text('project_url'),
  published: boolean('published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  reference: text('reference').notNull().unique(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  serviceOfInterest: text('service_of_interest'),
  budgetRange: text('budget_range'),
  projectDescription: text('project_description').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const inquiryNotes = pgTable('inquiry_notes', {
  id: serial('id').primaryKey(),
  inquiryId: integer('inquiry_id').notNull().references(() => inquiries.id),
  note: text('note').notNull(),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  category: text('category'),
  displayOrder: integer('display_order').notNull().default(0),
  published: boolean('published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  reference: text('reference').notNull().unique(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name'),
  totalAmount: integer('total_amount').notNull(),
  currency: text('currency').notNull().default('USD'),
  status: text('status').notNull().default('pending'),
  paymentIntentId: text('payment_intent_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
