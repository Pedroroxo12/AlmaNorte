<?php
// gallery.php

require_once __DIR__ . '/config.php';

// Your PHP code for the gallery API will go here.

header('Content-Type: application/json');

// Directory containing images
$imagesDir = __DIR__ . '/../assets/images/gallery/';

$imagesUrl = SITEURL . '/assets/images/gallery/';

// Allowed image extensions
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

// Sample product data
$productData = [
    'image (1).png' => ['price' => '15.00€', 'description' => 'Mel de Trás-os-Montes, puro e natural.'],
    'image (2).jpg.png' => ['price' => '8.50€', 'description' => 'Azeite extra virgem da região.'],
    'image (3).jpg.png' => ['price' => '12.00€', 'description' => 'Queijo artesanal maturado.'],
    'image (4).jpg.png' => ['price' => '20.00€', 'description' => 'Vinho tinto regional.'],
];

// Scan directory for images
$images = [];
if (is_dir($imagesDir)) {
    foreach (scandir($imagesDir) as $file) {
        $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($ext, $allowedExtensions)) {
            $data = $productData[$file] ?? ['price' => 'Preço sob consulta', 'description' => 'Produto tradicional de Trás-os-Montes.'];
            $images[] = [
                'url' => $imagesUrl . $file,
                'caption' => 'Produto Tradicional: ' . pathinfo($file, PATHINFO_FILENAME),
                'price' => $data['price'],
                'description' => $data['description']
            ];
        }
    }
}


// Debugging function
function debug($varName, $varValue)
{
    if (DEBUG) {
        error_log("DEBUG: $varName = " . print_r($varValue, true));
    }
}

// Return JSON response
echo json_encode(['images' => $images]);