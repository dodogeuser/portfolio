<?php
require __DIR__ . '/includes/bootstrap.php';
header('Location: ' . site_url('index.php#about'), true, 302);
exit;
