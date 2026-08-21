<?php

// TEMPORARY diagnostic endpoint - remove once the current production issue is
// resolved. Same token as the other deploy hooks, read-only, no writes.

$envLocal = __DIR__ . '/../.env.local';
$token = null;
if (\is_file($envLocal)) {
    foreach (\file($envLocal, \FILE_IGNORE_NEW_LINES) as $line) {
        if (0 === \strpos($line, 'DEPLOY_CACHE_CLEAR_TOKEN=')) {
            $token = \trim(\substr($line, \strlen('DEPLOY_CACHE_CLEAR_TOKEN=')), " \t\"'");
        }
    }
}

$provided = $_GET['token'] ?? '';
if (!$token || !\hash_equals($token, $provided)) {
    http_response_code(404);
    exit;
}

header('Content-Type: text/plain');

$lines = (int) ($_GET['lines'] ?? 200);
$file = $_GET['file'] ?? 'website';
$allowed = [
    'website' => __DIR__ . '/../var/log/website/prod.log',
    'admin' => __DIR__ . '/../var/log/admin/prod.log',
];

if (!isset($allowed[$file])) {
    http_response_code(400);
    echo "invalid file param\n";
    exit;
}

$path = $allowed[$file];
if (!\is_file($path)) {
    echo "log file does not exist: {$path}\n";
    exit;
}

echo "size: " . \filesize($path) . " bytes\n\n";

// Tail without loading the whole (possibly huge) file into memory.
$fp = \fopen($path, 'rb');
$buffer = '';
$chunkSize = 4096;
\fseek($fp, 0, \SEEK_END);
$pos = \ftell($fp);
$linesFound = 0;

while ($pos > 0 && $linesFound <= $lines) {
    $readSize = \min($chunkSize, $pos);
    $pos -= $readSize;
    \fseek($fp, $pos);
    $chunk = \fread($fp, $readSize);
    $buffer = $chunk . $buffer;
    $linesFound = \substr_count($buffer, "\n");
}
\fclose($fp);

$allLines = \explode("\n", $buffer);
echo \implode("\n", \array_slice($allLines, -$lines));
