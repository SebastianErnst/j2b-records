<?php

// Uploading ~16k individual files over FTP takes hours, so the deploy pipeline
// instead uploads a single deploy-payload.zip and calls this endpoint to
// extract it in place. Secured with the same token as deploy-cache-clear.php.

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

// Lives one level above the web root (next to .env.local) so it's never
// reachable over HTTP, not even for the brief moment before it's deleted.
$projectRoot = \dirname(__DIR__);
$zipPath = $projectRoot . '/deploy-payload.zip';
if (!\is_file($zipPath)) {
    http_response_code(500);
    echo "missing deploy-payload.zip\n";
    exit;
}

$zip = new ZipArchive();
if (true !== $zip->open($zipPath)) {
    http_response_code(500);
    echo "could not open deploy-payload.zip\n";
    exit;
}

// Defense in depth: refuse to extract if any entry tries to escape the project root.
for ($i = 0; $i < $zip->numFiles; $i++) {
    $name = $zip->getNameIndex($i);
    if (false === $name || false !== \strpos($name, '..') || 0 === \strpos($name, '/')) {
        $zip->close();
        http_response_code(400);
        echo "unsafe archive entry: {$name}\n";
        exit;
    }
}

$zip->extractTo($projectRoot);
$zip->close();
\unlink($zipPath);

echo "ok\n";
