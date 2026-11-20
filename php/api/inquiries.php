<?php
/**
 * Inquiries API endpoint for PHP
 * Handles GET (listing inquiries) and POST (creating a new inquiry)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/db.php';
$pdo = Database::getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->prepare("
            SELECT id, reference, name, email, phone, telegram, service_of_interest, budget_range, timeline, project_description, status, created_at 
            FROM inquiries 
            ORDER BY created_at DESC 
            LIMIT 50
        ");
        $stmt->execute();
        $inquiries = $stmt->fetchAll();

        echo json_encode([
            "success" => true,
            "count"   => count($inquiries),
            "data"    => $inquiries
        ], JSON_PRETTY_PRINT);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid JSON payload"]);
        exit;
    }

    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $projectDescription = trim($input['project_description'] ?? '');

    if (empty($name) || empty($email) || empty($projectDescription)) {
        http_response_code(422);
        echo json_encode([
            "success" => false,
            "message" => "Name, email, and project_description are required."
        ]);
        exit;
    }

    $reference = 'INQ-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
    $phone = $input['phone'] ?? null;
    $telegram = $input['telegram'] ?? null;
    $service = $input['service_of_interest'] ?? null;
    $budget = $input['budget_range'] ?? null;
    $timeline = $input['timeline'] ?? null;

    try {
        $stmt = $pdo->prepare("
            INSERT INTO inquiries (
                reference, name, email, phone, telegram,
                service_of_interest, budget_range, timeline, project_description
            ) VALUES (
                :reference, :name, :email, :phone, :telegram,
                :service_of_interest, :budget_range, :timeline, :project_description
            ) RETURNING id, reference, created_at
        ");

        $stmt->execute([
            ':reference'           => $reference,
            ':name'                => $name,
            ':email'               => $email,
            ':phone'               => $phone,
            ':telegram'            => $telegram,
            ':service_of_interest' => $service,
            ':budget_range'        => $budget,
            ':timeline'            => $timeline,
            ':project_description' => $projectDescription,
        ]);

        $created = $stmt->fetch();

        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Inquiry submitted successfully",
            "data"    => $created
        ], JSON_PRETTY_PRINT);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
}
