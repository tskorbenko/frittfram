<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function respond(int $status, bool $success, string $message): never
{
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, false, 'Method not allowed.');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 20000) {
    respond(413, false, 'Request too large.');
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = strtolower((string) parse_url($origin, PHP_URL_HOST));
    $allowedHosts = ['fritt-fram.se', 'www.fritt-fram.se', '127.0.0.1', 'localhost'];
    if (!in_array($originHost, $allowedHosts, true)) {
        respond(403, false, 'Invalid origin.');
    }
}

session_start();
$now = time();
$lastSubmission = (int) ($_SESSION['last_offer_submission'] ?? 0);
if ($lastSubmission > 0 && ($now - $lastSubmission) < 15) {
    respond(429, false, 'Please wait before sending another request.');
}

if (trim((string) ($_POST['website'] ?? '')) !== '') {
    respond(200, true, 'Message accepted.');
}

$name = trim((string) ($_POST['name'] ?? ''));
$company = trim((string) ($_POST['company'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$service = trim((string) ($_POST['service'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$consent = (string) ($_POST['consent'] ?? '');

if ($name === '' || $company === '' || $message === '' || $consent !== 'on') {
    respond(422, false, 'Required fields are missing.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'Invalid email address.');
}
if (strlen($name) > 100 || strlen($company) > 150 || strlen($email) > 254 || strlen($phone) > 50 || strlen($service) > 100 || strlen($message) > 5000) {
    respond(422, false, 'One or more fields are too long.');
}

$name = str_replace(["\r", "\n"], ' ', $name);
$company = str_replace(["\r", "\n"], ' ', $company);
$email = str_replace(["\r", "\n"], '', $email);
$phone = str_replace(["\r", "\n"], ' ', $phone);
$service = str_replace(["\r", "\n"], ' ', $service);

$recipient = 'kontakt@fritt-fram.se';
$subjectText = 'Ny offertförfrågan från ' . $name;
$subject = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';
$body = implode("\n", [
    'Ny offertförfrågan via fritt-fram.se',
    '',
    'Namn: ' . $name,
    'Företag: ' . $company,
    'E-post: ' . $email,
    'Telefon: ' . ($phone !== '' ? $phone : 'Ej angivet'),
    'Tjänst: ' . ($service !== '' ? $service : 'Ej angivet'),
    '',
    'Projektbeskrivning:',
    $message,
]);
$headers = implode("\r\n", [
    'From: FrittFram Webbyrå <kontakt@fritt-fram.se>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: FrittFram Website',
]);

if (!mail($recipient, $subject, $body, $headers)) {
    respond(500, false, 'The message could not be sent.');
}

$_SESSION['last_offer_submission'] = $now;
respond(200, true, 'Message sent successfully.');
