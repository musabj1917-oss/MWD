<?php
/**
 * Database connection manager using PHP PDO (pdo_pgsql)
 * Configured for remote serverless PostgreSQL (Neon, CockroachDB, Supabase, Aiven)
 */

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            // Load environment variables or use defaults
            $databaseUrl = getenv('DATABASE_URL');

            if ($databaseUrl) {
                // Parse postgres://user:pass@host:port/dbname?sslmode=require
                $parts = parse_url($databaseUrl);
                $host = $parts['host'] ?? 'localhost';
                $port = $parts['port'] ?? 5432;
                $user = $parts['user'] ?? '';
                $pass = $parts['pass'] ?? '';
                $dbname = isset($parts['path']) ? ltrim($parts['path'], '/') : '';
            } else {
                $host   = getenv('DB_HOST')     ?: 'localhost';
                $port   = getenv('DB_PORT')     ?: '5432';
                $dbname = getenv('DB_NAME')     ?: 'mwd';
                $user   = getenv('DB_USER')     ?: 'postgres';
                $pass   = getenv('DB_PASSWORD') ?: '';
            }

            // Both Neon and CockroachDB require SSL
            $dsn = sprintf(
                "pgsql:host=%s;port=%s;dbname=%s;sslmode=require",
                $host,
                $port,
                $dbname
            );

            try {
                self::$instance = new PDO($dsn, $user, $pass, [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                    PDO::ATTR_TIMEOUT            => 10,
                ]);
            } catch (PDOException $e) {
                error_log("Database connection error: " . $e->getMessage());
                http_response_code(500);
                echo json_encode([
                    "error"   => true,
                    "message" => "Database connection failed: " . $e->getMessage()
                ]);
                exit;
            }
        }

        return self::$instance;
    }
}
