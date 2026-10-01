<?php
require __DIR__ . '/includes/contact-state.php';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'GET' || $method === 'HEAD') {
    header('Location: ' . site_url('index.php#contact'), true, 302);
    exit;
}
if ($method !== 'POST') {
    header('Allow: GET, HEAD, POST');
    http_response_code(405);
    $contactErrors['request'] = 'This form only accepts POST submissions.';
} elseif ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) {
    http_response_code(413);
    $contactErrors['request'] = 'The submitted form is too large. Please enter a shorter message.';
} elseif (!is_string($_POST['csrf_token'] ?? null) || !hash_equals($contactToken, $_POST['csrf_token'])) {
    http_response_code(403);
    $contactErrors['request'] = 'Your form session could not be verified. Reload the portfolio and try again.';
} else {
    foreach ($contactLimits as $field => $limit) {
        $raw = $_POST[$field] ?? null;
        if (!is_string($raw) || preg_match('//u', $raw) !== 1) {
            $contactErrors[$field] = ucfirst($field) . ' must contain valid text.';
            continue;
        }
        $value = trim(str_replace(["\r\n", "\r"], "\n", $raw));
        if (strlen($value) > $limit) {
            $contactErrors[$field] = ucfirst($field) . ' must be at most ' . $limit . ' bytes. Accented and non-Latin characters may use multiple bytes.';
            continue;
        }
        $contactValues[$field] = $value;
        if ($value === '') {
            $contactErrors[$field] = ucfirst($field) . ' is required.';
        } elseif (preg_match($field === 'message' ? '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/' : '/[\x00-\x1F\x7F]/', $value)) {
            $contactErrors[$field] = ucfirst($field) . ' contains unsupported control characters.';
        }
    }
    if (!isset($contactErrors['email']) && !filter_var($contactValues['email'], FILTER_VALIDATE_EMAIL)) {
        $contactErrors['email'] = 'Enter a valid email address.';
    }
    if ($contactErrors !== []) {
        http_response_code(422);
    } else {
        $body = 'From: ' . $contactValues['name'] . ' <' . $contactValues['email'] . ">\n\n" . $contactValues['message'];
        $contactMailto = 'mailto:georgesyouhannna@hotmail.com?' . http_build_query(['subject' => $contactValues['subject'], 'body' => $body], '', '&', PHP_QUERY_RFC3986);
    }
}
$pageTitle = 'Contact | George Youkhanna';
require __DIR__ . '/includes/header.php';
?>
<main id="main-content" class="container detail-page">
    <a class="text-link" href="<?= escape(site_url('index.php#contact')) ?>">← Back to portfolio</a>
    <?php require __DIR__ . '/includes/contact-form.php'; ?>
</main>
<?php require __DIR__ . '/includes/footer.php'; ?>
