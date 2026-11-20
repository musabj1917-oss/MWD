<?php
/**
 * Schema Migration Script for PostgreSQL (Neon / CockroachDB)
 * Run this via command line: php php/migrate.php
 * Or via web browser when deploying to a PHP host.
 */

require_once __DIR__ . '/config/db.php';

header('Content-Type: text/plain; charset=utf-8');

echo "==> Connecting to PostgreSQL Database...\n";
$pdo = Database::getConnection();
echo "==> Connected successfully!\n\n";

$ddl = [
    "Users" => "
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT,
            image TEXT,
            role TEXT NOT NULL DEFAULT 'user',
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    ",

    "Services" => "
        CREATE TABLE IF NOT EXISTS services (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL,
            published BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    ",

    "Packages" => "
        CREATE TABLE IF NOT EXISTS packages (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            price INTEGER NOT NULL,
            currency TEXT NOT NULL DEFAULT 'USD',
            billing_type TEXT NOT NULL DEFAULT 'one-time',
            published BOOLEAN NOT NULL DEFAULT false,
            service_id INTEGER REFERENCES services(id),
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    ",

    "Portfolio Projects" => "
        CREATE TABLE IF NOT EXISTS portfolio_projects (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            summary TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT,
            cover_image TEXT,
            gallery TEXT[],
            project_url TEXT,
            published BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    ",

    "Inquiries" => "
        CREATE TABLE IF NOT EXISTS inquiries (
            id SERIAL PRIMARY KEY,
            reference TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            telegram TEXT,
            service_of_interest TEXT,
            budget_range TEXT,
            timeline TEXT,
            project_description TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'new',
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    ",

    "Inquiry Notes" => "
        CREATE TABLE IF NOT EXISTS inquiry_notes (
            id SERIAL PRIMARY KEY,
            inquiry_id INTEGER NOT NULL REFERENCES inquiries(id),
            note TEXT NOT NULL,
            created_by INTEGER REFERENCES users(id),
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    ",

    "FAQs" => "
        CREATE TABLE IF NOT EXISTS faqs (
            id SERIAL PRIMARY KEY,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            category TEXT,
            display_order INTEGER NOT NULL DEFAULT 0,
            published BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    ",

    "Orders" => "
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            reference TEXT NOT NULL UNIQUE,
            customer_email TEXT NOT NULL,
            customer_name TEXT,
            total_amount INTEGER NOT NULL,
            currency TEXT NOT NULL DEFAULT 'USD',
            status TEXT NOT NULL DEFAULT 'pending',
            payment_intent_id TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    ",

    "Images" => "
        CREATE TABLE IF NOT EXISTS images (
            id TEXT PRIMARY KEY,
            filename TEXT,
            content_type TEXT NOT NULL,
            size INTEGER NOT NULL,
            data BYTEA NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    ",

    "Inquiry Attachments" => "
        CREATE TABLE IF NOT EXISTS inquiry_attachments (
            id SERIAL PRIMARY KEY,
            inquiry_id INTEGER NOT NULL REFERENCES inquiries(id) ON DELETE CASCADE,
            filename TEXT,
            content_type TEXT NOT NULL,
            size INTEGER NOT NULL,
            data BYTEA NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    ",

    "Telegram Processed Updates" => "
        CREATE TABLE IF NOT EXISTS telegram_processed_updates (
            update_id TEXT PRIMARY KEY,
            processed_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    ",

    "Telegram Sessions" => "
        CREATE TABLE IF NOT EXISTS telegram_sessions (
            chat_id TEXT PRIMARY KEY,
            step TEXT NOT NULL DEFAULT 'idle',
            data TEXT,
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    ",

    "Bot Messages" => "
        CREATE TABLE IF NOT EXISTS bot_messages (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
    "
];

foreach ($ddl as $tableName => $sql) {
    try {
        $pdo->exec($sql);
        echo "[OK] Table initialized: {$tableName}\n";
    } catch (PDOException $e) {
        echo "[ERROR] Failed to initialize {$tableName}: " . $e->getMessage() . "\n";
    }
}

echo "\n==> All migrations finished successfully!\n";
