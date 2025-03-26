<?php
session_start();

function verificarSesion($tipoUsuario = null) {
    if (!isset($_SESSION['usuario'])) {
        header("Location: ../pages/login.php");
        exit();
    }

    if ($tipoUsuario && $_SESSION['tipo'] !== $tipoUsuario) {
        header("Location: ../index.php");
        exit();
    }
}
?>
