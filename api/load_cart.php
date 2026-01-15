<?php
// load_cart.php
include 'db.inc';

session_start();
$session_id = session_id();

$result = $conn->query("SELECT product_name, product_price, product_image, quantity FROM cart WHERE session_id = '$session_id'");

$cart = [];
while ($row = $result->fetch_assoc()) {
    $cart[] = [
        'name' => $row['product_name'],
        'price' => $row['product_price'],
        'image' => $row['product_image'],
        'quantity' => $row['quantity']
    ];
}

echo json_encode($cart);

$conn->close();
?>