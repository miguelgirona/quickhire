$(document).ready(function () {
    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) {
            return decodeURIComponent(match[2]);
        }
        return null;
    }

    var csrfToken = getCookie('csrf_cookie_name');

    if (sessionStorage.user) {
        if (JSON.parse(sessionStorage.user).tipo_usuario != "Empresa") {
            window.location.href = "https://miguelgirona.com.es/quickhire";
        }
        var user = JSON.parse(sessionStorage.user);
    }

    function getUsuario(id, token) {
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/usuarios/" + id,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            }
        });
    }

    function getCandidato(id, token) {
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/showByIdCandidato/" + id,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            }
        });
    }

    function getChats(idEmpresa, token) {
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/chats/showByIdEmpresa/" + idEmpresa,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            }
        });
    }

    function getEmpresa(id, token) {
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/empresas/showByUserId/" + id,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            }
        });
    }

    function getMessagesByChatId(chatId, token) {
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/mensajes/getByChatId/" + chatId,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            }
        });
    }

    function saveMessage(messageData, token) {
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/mensajes/save",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            },
            data: messageData
        });
    }

    let selectedChatId = null; // ID del chat seleccionado

    getEmpresa(user.id, sessionStorage.token).then(e => {
        let empresa = e[0];

        getChats(empresa.id, sessionStorage.token).then(chats => {
            chats.forEach(chat => {
                getCandidato(chat.id_candidato, sessionStorage.token).then(c => {
                    let candidato = c[0];
                    getUsuario(candidato.id_usuario, sessionStorage.token).then(usuario => {
                        $("#chats").append(
                            `<div class='user-chat' id='${chat.id} '>
                                <img src='${usuario.url_imagen}' alt='Imagen usuario'>
                                <div>
                                    <h4>${candidato.nombre} ${candidato.apellidos}</h4>
                                </div>
                            </div>`
                        );
                    });

                });
            });
        });
    });

    // Conexión al servidor WebSocket
    // 1) ws debe ser let si quieres reassign en onclose
    let ws = connectSocket();

    console.log(ws.readyState); 
    

    function connectSocket() {
        return new WebSocket(`wss://though-isle-stud-preventing.trycloudflare.com`);
    }
    
    function scrollToBottom() {
        var messagesContainer = $("#messages");
        messagesContainer.scrollTop(messagesContainer[0].scrollHeight);
    }
    

    ws.onopen = function () {
        console.log('WebSocket connection established');
    };

    ws.onmessage = function (e) {
        const data = JSON.parse(e.data);

        // Mostrar el mensaje solo si pertenece al chat seleccionado
        if (data.id_chat == selectedChatId) {
            $("#messages").append(
                `<div class="message">
                    <strong>${data.sender}:</strong> ${data.message}
                    <span class="timestamp">${new Date(data.timestamp).toLocaleDateString('es-ES', {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })}</span>
                </div>`
            );
        }
        scrollToBottom(); // Desplazar hacia abajo al recibir un nuevo mensaje
    };

    ws.onclose = function() {
        console.log('WS cerrado, reintentando...');
        setTimeout(() => { ws = connectSocket(); }, 1000);
    };

    ws.onerror = (err) => {
        console.error("WebSocket error:", err);
    };

    // Detectar clic en un chat
    $(document).on("click", ".user-chat", function () {
        
        selectedChatId = $(this).attr("id"); // Obtener el ID del chat seleccionado
        
        if (!selectedChatId) {
            console.error("No se pudo obtener el ID del chat seleccionado.");
            return;
        }

        // Limpiar mensajes previos y cargar mensajes del chat seleccionado
        $("#messages").empty();
        getMessagesByChatId(selectedChatId, sessionStorage.token).then(messages => {
            messages.messages.forEach(message => {
                $("#messages").append(
                    `<div class="message">
                        <strong>${message.id_remitente == user.id ? user.nombre : "Candidato/a"}:</strong> ${message.mensaje}
                        <span class="timestamp">${new Date(message.fecha_envio).toLocaleDateString('es-ES', {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}</span>
                    </div>`
                );
            });
            scrollToBottom(); // Desplazar hacia abajo al seleccionar un chat
        }).catch(err => {
            console.error("Error al cargar los mensajes:", err);
        });
    });

    // Enviar mensaje
    $("#sendMessage").on("click", function () {
        if (!selectedChatId) {
            alert("Por favor, selecciona un chat antes de enviar un mensaje.");
            return;
        }

        const messageContent = $("#messageInput").val().trim();
        if (!messageContent) {
            alert("El mensaje no puede estar vacío.");
            return;
        }

        const messageData = {
            id_chat: selectedChatId,
            id_remitente: user.id,
            mensaje: messageContent
        };

        // Guardar mensaje en la base de datos y enviarlo por WebSocket
        saveMessage(messageData, sessionStorage.token).then(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    id_chat: selectedChatId,
                    sender: user.nombre,
                    message: messageData.mensaje,
                    timestamp: new Date().toISOString()
                }));
            } else {
                console.error("WebSocket no está abierto.");
            }

            $("#messageInput").val(''); // Limpiar el campo de entrada
            scrollToBottom(); // Desplazar hacia abajo al enviar un nuevo mensaje
        }).catch(err => {
            console.error("Error al guardar el mensaje:", err);
        });
    });
});