<?php
// api/get_products.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require __DIR__ . '/../config.php';  // Ajuste o caminho se necessário

$stmt = $pdo->query("
    SELECT 
      id,
      COD    AS code,
      nome,
      descritivo,
      preco,
      foto,
      category_id,
      oculto
    FROM products
    ORDER BY id DESC
");
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($products);
