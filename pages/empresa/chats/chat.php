<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - Mis Chats</title>
    <link rel="icon" href="/quickhire/assets/img/iconos/logo.png" type="image/png">
    <link rel="stylesheet" href="/quickhire/assets/css/menu.css">
    <link rel="stylesheet" href="/quickhire/assets/css/footer.css">
    <link rel="stylesheet" href="/quickhire/assets/css/chats.css">
    <script src="/quickhire/assets/js/jquery.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="/quickhire/assets/js/main.js"></script>
    <script src="/quickhire/assets/js/empresa/chats/chat.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../../../includes/menu.php")?>
        <div id="content">
            <h1>Chats</h1>
            <div>
                <aside id="chats"></aside>
                <div id="chat">
                    <div id="messages" style="max-height: 400px; overflow-y: auto; border: 1px solid #ccc; padding: 10px;"></div>
                    <div id="message-box" style="margin-top: 10px;">
                        <input type="text" id="messageInput" placeholder="Escribe un mensaje..." style="width: 80%; padding: 10px;">
                        <button id="sendMessage" style="padding: 10px;">Enviar</button>
                    </div>
                </div>
            </div>
        </div>
        <?php include_once("../../../includes/footer.php")?>
    </div>
</body>
</html>