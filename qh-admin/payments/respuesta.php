<?php
include 'config.php';
include '../../vendor/autoload.php';

use Redsys\Tpv;

$tpv = new Tpv();
$response = $_POST;  // Respuesta de Redsys

// Validar firma
if ($tpv->validateMerchantSignature(REDSYS_SECRET_KEY, $response)) {
    $order = $response['Ds_Order'];
    $status = $response['Ds_Response'];

    if ($status >= 0 && $status <= 99) {
        echo "Pago exitoso. Pedido: $order";
        // Registrar pago en la base de datos
    } else {
        echo "Pago rechazado. Código: $status";
    }
} else {
    echo "Firma no válida.";
}
?>
