<?php
// save_cart.php
include 'db.inc';

session_start();
$session_id = session_id();

$data = json_decode(file_get_contents('php://input'), true);

if ($data && isset($data['cart'])) {
    // Clear existing cart for this session
    $conn->query("DELETE FROM cart WHERE session_id = '$session_id'");

    // Insert new cart items
    foreach ($data['cart'] as $item) {
        $name = $conn->real_escape_string($item['name']);
        $price = $conn->real_escape_string($item['price']);
        $image = $conn->real_escape_string($item['image']);
        $quantity = (int)$item['quantity'];

        $sql = "INSERT INTO cart (session_id, product_name, product_price, product_image, quantity)
                VALUES ('$session_id', '$name', '$price', '$image', $quantity)";
        $conn->query($sql);
    }

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}

$conn->close();
?>