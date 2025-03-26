<?php

include('config.php');
include('../../vendor/autoload.php');
require_once("../../vendor/redsys/tpv/src/Redsys/Tpv/Tpv.php");
require_once("../../vendor/redsys/tpv/src/Redsys/Tpv/Signature.php");

use Redsys\Tpv\Tpv;
use Redsys\Tpv\Signature;

// Configuración del TPV
$tpv = new Tpv([
    'Environment' => 'test', // 'real' para producción
    'MerchantCode' => REDSYS_MERCHANT_CODE,
    'Key' => REDSYS_SECRET_KEY,
    'SignatureVersion' => 'HMAC_SHA256_V1'
]);

// Definir el monto y el pedido (el monto debe estar en céntimos y como string)
$amount = "5.99"; // 10.00 EUR en céntimos (string)
$order = strval(time()); // Número de pedido único

// Validaciones previas
if (empty($amount) || !is_numeric($amount)) {
    die("Error: El monto es inválido o está vacío.");
}
if (empty($order)) {
    die("Error: El número de pedido es inválido.");
}

// Asignación de los parámetros usando claves correctas
$params = [
    "Ds_Merchant_Amount" => $amount,  
    "Ds_Merchant_Order" => $order,
    "Ds_Merchant_MerchantCode" => REDSYS_MERCHANT_CODE,
    "Ds_Merchant_Currency" => REDSYS_CURRENCY,
    "Ds_Merchant_TransactionType" => REDSYS_TRANSACTION_TYPE,
    "Ds_Merchant_Terminal" => REDSYS_TERMINAL,
    "Ds_Merchant_MerchantURL" => "https://miguelgirona.com.es/quickhire/qh-admin/payments/respuesta.php",
    "Ds_Merchant_UrlOK" => "https://miguelgirona.com.es/quickhire/qh-admin/payments/exito.php",
    "Ds_Merchant_UrlKO" => "https://miguelgirona.com.es/quickhire/qh-admin/payments/error.php"
];

// Enviar parámetros al TPV
$tpv->setFormHiddens([
    "Amount" => $amount,  
    "Order" => $order,
    "MerchantCode" => REDSYS_MERCHANT_CODE,
    "Currency" => REDSYS_CURRENCY,
    "TransactionType" => REDSYS_TRANSACTION_TYPE,
    "Terminal" => REDSYS_TERMINAL,
    "MerchantURL" => "http://localhost/quickhire/qh-admin/payments/respuesta.php",
    "UrlOK" => "http://localhost/quickhire",
    "UrlKO" => "http://localhost/quickhire"
]);


// Depuración: Verificar el contenido de `$merchantParameters`
$merchantParameters = $tpv->getMerchantParametersEncoded();
if (empty($merchantParameters)) {
    die("Error: Los parámetros codificados están vacíos.");
}


// Obtener la firma
$signature = $tpv->getValuesSignature();
if (empty($signature)) {
    die("Error: La firma no se generó correctamente.");
}

// Generación del formulario HTML
echo '<form id="redsysForm" action="' . $tpv->getPath() . '" method="POST">';
echo '<input type="hidden" name="Ds_SignatureVersion" value="HMAC_SHA256_V1">';
echo '<input type="hidden" name="Ds_MerchantParameters" value="' . $merchantParameters . '">';
echo '<input type="hidden" name="Ds_Signature" value="' . $signature . '">';
echo '</form>';
echo '<script>document.getElementById("redsysForm").submit();</script>';


?>
