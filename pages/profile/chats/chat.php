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
    <script src="https://js.pusher.com/7.0/pusher.min.js"></script>

    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="/quickhire/assets/js/main.js"></script>
    <script src="/quickhire/assets/js/profile/chats/chat.js"></script>
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
                    <div class="file-upload">
                            <input type="file" id="fileInput" class="file-input" />
                            <label for="fileInput" class="file-label">
                                <svg class="icon-upload" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M.5 9.9v3.6C.5 14.66 1.34 15.5 2.4 15.5h11.2c1.06 0 1.9-.84 1.9-1.9V9.9h-1v3.6c0 .5-.4.9-.9.9H2.4c-.5 0-.9-.4-.9-.9V9.9h-1z"/>
                                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V10.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                </svg>
                                <span class="file-label-text">Seleccionar archivo</span>
                            </label>
                        </div>
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