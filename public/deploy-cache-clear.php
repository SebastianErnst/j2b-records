<?php

// Shared FTP hosting has no shell/SSH access, so the deploy pipeline clears the
// stale prod cache by calling this endpoint instead of running bin/console.
// Secured by a random token that must be set as the DEPLOY_CACHE_CLEAR_TOKEN
// secret/env var; requests without a matching token are rejected.

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

function rrmdir(string $dir): void
{
    if (!\is_dir($dir)) {
        return;
    }
    foreach (\scandir($dir) as $item) {
        if ('.' === $item || '..' === $item) {
            continue;
        }
        $path = $dir . \DIRECTORY_SEPARATOR . $item;
        \is_dir($path) ? rrmdir($path) : \unlink($path);
    }
    \rmdir($dir);
}

rrmdir(__DIR__ . '/../var/cache/prod');

header('Content-Type: text/plain');
echo "ok\n";
