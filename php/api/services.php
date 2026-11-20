<?php
/**
 * Services & Packages API endpoint for PHP
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';
$pdo = Database::getConnection();

try {
    // Fetch all published services
    $servicesStmt = $pdo->prepare("
        SELECT id, name, slug, description 
        FROM services 
        WHERE published = true 
        ORDER BY id ASC
    ");
    $servicesStmt->execute();
    $services = $servicesStmt->fetchAll();

    // Fetch published packages
    $packagesStmt = $pdo->prepare("
        SELECT id, name, slug, description, price, currency, billing_type, service_id 
        FROM packages 
        WHERE published = true 
        ORDER BY id ASC
    ");
    $packagesStmt->execute();
    $packages = $packagesStmt->fetchAll();

    // Nest packages under services
    $packagesByService = [];
    foreach ($packages as $pkg) {
        $packagesByService[$pkg['service_id']][] = $pkg;
    }

    foreach ($services as &$service) {
        $service['packages'] = $packagesByService[$service['id']] ?? [];
    }

    echo json_encode([
        "success" => true,
        "count"   => count($services),
        "data"    => $services
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
