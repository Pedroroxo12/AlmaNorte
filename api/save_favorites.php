<?php
// save_favorites.php
include 'db.inc';

session_start();
$session_id = session_id();

$data = json_decode(file_get_contents('php://input'), true);

if ($data && isset($data['favorites'])) {
    // Clear existing favorites for this session
    $conn->query("DELETE FROM favorites WHERE session_id = '$session_id'");

    // Insert new favorites
    foreach ($data['favorites'] as $item) {
        $name = $conn->real_escape_string($item['name']);
        $price = $conn->real_escape_string($item['price']);
        $image = $conn->real_escape_string($item['image']);

        $sql = "INSERT INTO favorites (session_id, product_name, product_price, product_image)
                VALUES ('$session_id', '$name', '$price', '$image')";
        $conn->query($sql);
    }

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}

$conn->close();
?>