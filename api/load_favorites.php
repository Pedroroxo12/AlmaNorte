<?php
// load_favorites.php
include 'db.inc';

session_start();
$session_id = session_id();

$result = $conn->query("SELECT product_name, product_price, product_image FROM favorites WHERE session_id = '$session_id'");

$favorites = [];
while ($row = $result->fetch_assoc()) {
    $favorites[] = [
        'name' => $row['product_name'],
        'price' => $row['product_price'],
        'image' => $row['product_image']
    ];
}

echo json_encode($favorites);

$conn->close();
?>