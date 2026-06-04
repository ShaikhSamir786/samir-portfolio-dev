import { pgTable, text, boolean, timestamp, uuid, integer, jsonb, date } from "drizzle-orm/pg-core";

export const adminUsers = pgTable('admin_users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const projects = pgTable('projects', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').unique().notNull(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    technologies: text('technologies').array(),
    githubLink: text('github_link'),
    demoLink: text('demo_link'),
    coverImageUrl: text('cover_image_url'),
    isPublished: boolean('is_published').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
});

export const blogs = pgTable('blogs', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').unique().notNull(),
    excerpt: text('excerpt'),
    content: text('content').notNull(),
    coverImageUrl: text('cover_image_url'),
    isPublished: boolean('is_published').default(false),
    stars: integer('stars').default(0),
    comments: jsonb('comments').default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
});

export const about = pgTable('about', {
    description: text('description'),
});

export const resume = pgTable('resume', {
    resume: text('resume'),
});

export const contact = pgTable('contact', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name'),
    email: text('email'),
    subject: text('subject'),
    message: text('message'),
    seen: boolean('seen').default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const socials = pgTable('socials', {
    name: text('name'),
    url: text('url'),
    displayOrder: integer('display_order'),
});

export const pushSubscriptions = pgTable('push_subscriptions', {
    id: uuid('id').defaultRandom().primaryKey(),
    endpoint: text('endpoint').unique().notNull(),
    subscriptionJson: jsonb('subscription_json').notNull(),
    topic: text('topic').notNull().default('all'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const sentNotifications = pgTable('sent_notifications', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    url: text('url'),
    imageUrl: text('image_url'),
    targetTopic: text('target_topic').notNull(),
    successCount: integer('success_count').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const experiences = pgTable('experiences', {
    id: uuid('id').defaultRandom().primaryKey(),
    companyName: text('company_name').notNull(),
    logoUrl: text('logo_url'),
    position: text('position').notNull(),
    description: text('description'),
    startDate: date('start_date', { mode: 'string' }).notNull(),
    endDate: date('end_date', { mode: 'string' }),
    pay: text('pay'),
    isCurrent: boolean('is_current').default(false),
    displayOrder: integer('display_order'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const media = pgTable('media', {
    id: uuid('id').defaultRandom().primaryKey(),
    url: text('url').notNull(),
    publicId: text('public_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
