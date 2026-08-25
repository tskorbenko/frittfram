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

function smtpRead($socket): string
{
    $response = '';
    while (($line = fgets($socket, 515)) !== false) {
        $response .= $line;
        if (strlen($line) >= 4 && $line[3] === ' ') {
            break;
        }
    }
    return $response;
}

function smtpCommand($socket, string $command, array $expectedCodes): string
{
    if ($command !== '') {
        if (fwrite($socket, $command . "\r\n") === false) {
            throw new RuntimeException('SMTP write failed.');
        }
    }

    $response = smtpRead($socket);
    $code = (int) substr($response, 0, 3);
    if (!in_array($code, $expectedCodes, true)) {
        throw new RuntimeException('SMTP command failed with code ' . $code . '.');
    }
    return $response;
}

function sendViaSmtp(
    string $username,
    string $password,
    array $recipients,
    string $replyTo,
    string $subject,
    string $body
): void {
    $context = stream_context_create([
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
            'allow_self_signed' => false,
        ],
    ]);

    $socket = @stream_socket_client(
        'ssl://smtp.hostinger.com:465',
        $errorNumber,
        $errorMessage,
        15,
        STREAM_CLIENT_CONNECT,
        $context
    );
    if ($socket === false) {
        throw new RuntimeException('SMTP connection failed.');
    }

    stream_set_timeout($socket, 15);
    try {
        smtpCommand($socket, '', [220]);
        smtpCommand($socket, 'EHLO fritt-fram.se', [250]);
        smtpCommand($socket, 'AUTH LOGIN', [334]);
        smtpCommand($socket, base64_encode($username), [334]);
        smtpCommand($socket, base64_encode($password), [235]);
        smtpCommand($socket, 'MAIL FROM:<' . $username . '>', [250]);
        foreach ($recipients as $recipient) {
            smtpCommand($socket, 'RCPT TO:<' . $recipient . '>', [250, 251]);
        }
        smtpCommand($socket, 'DATA', [354]);

        $headers = implode("\r\n", [
            'From: FrittFram Webbyrå <' . $username . '>',
            'To: tskorbenko@gmail.com',
            'Reply-To: ' . $replyTo,
            'Subject: ' . $subject,
            'Date: ' . date(DATE_RFC2822),
            'Message-ID: <' . bin2hex(random_bytes(16)) . '@fritt-fram.se>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ]);
        $message = $headers . "\r\n\r\n" . str_replace("\n", "\r\n", str_replace("\r", '', $body));
        $message = preg_replace('/^\./m', '..', $message) ?? $message;
        smtpCommand($socket, $message . "\r\n.", [250]);
        smtpCommand($socket, 'QUIT', [221]);
    } finally {
        fclose($socket);
    }
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

$recipient = 'tskorbenko@gmail.com';
$archiveRecipient = 'kontakt@fritt-fram.se';
$smtpUsername = 'kontakt@fritt-fram.se';
$smtpPassword = (string) (getenv('FRITTFRAM_SMTP_PASSWORD') ?: '');
$privateConfigPath = dirname(__DIR__) . '/frittfram-smtp.php';
if ($smtpPassword === '' && is_file($privateConfigPath)) {
    $privateConfig = require $privateConfigPath;
    if (is_array($privateConfig)) {
        $smtpPassword = (string) ($privateConfig['password'] ?? '');
    }
}
if ($smtpPassword === '') {
    respond(503, false, 'Email service is not configured.');
}
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
try {
    sendViaSmtp($smtpUsername, $smtpPassword, [$recipient, $archiveRecipient], $email, $subject, $body);
} catch (Throwable $error) {
    error_log('Offer form SMTP delivery failed: ' . $error->getMessage());
    respond(500, false, 'The message could not be sent.');
}

$_SESSION['last_offer_submission'] = $now;
respond(200, true, 'Message sent successfully.');
