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
        console.log(JSON.parse(sessionStorage.user).tipo_usuario);
        
        if (JSON.parse(sessionStorage.user).tipo_usuario != "Candidato") {
            //window.location.href = "https://miguelgirona.com.es/quickhire";
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
            url: "https://miguelgirona.com.es/quickhire_api/public/candidatos/" + id,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            }
        });
    }

    function getChats(idCandidato, token) {
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/chats/showByIdCandidato/" + idCandidato,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            }
        });
    }

    function getEmpresa(id) {
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/empresas/" + id,
            method: "GET"
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

    getCandidato(user.id, sessionStorage.token).then(c => {
        let candidato = c[0];
        console.log("Candidato: ", c);
        getChats(candidato.id, sessionStorage.token).then(chats => {
            chats.forEach(chat => {
                getEmpresa(chat.id_empresa).then(e => {
                    let empresa = e[0];
                    getUsuario(empresa.id_usuario, sessionStorage.token).then(usuario => {
                        console.log("Candidato: ", candidato);
                        console.log("Usuario: ", usuario);
                        console.log("Chat: ", chat);
                        
                        $("#chats").append(
                            `<div class='user-chat' id='${chat.id} '>
                                <img src='${usuario.url_imagen}' alt='Imagen usuario'>
                                <div>
                                    <h4>${empresa.nombre_empresa}</h4>
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
    console.log(ws);
    
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

    ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        // 2) Asume que selectedChatId ya es number
        console.log("Mensaje recibido:", data);
        console.log("ID del chat seleccionado:", selectedChatId);
        
        if (data.id_chat == selectedChatId) {
          $("#messages").append(`
            <div class="message">
              <strong>${data.sender}:</strong> ${data.message}
              <span class="timestamp">${new Date(data.timestamp).toLocaleDateString('es-ES', {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })}</span>
            </div>
          `);
        }
        scrollToBottom(); // Desplazar hacia abajo al recibir un nuevo mensaje
    };

    ws.onclose = () => {
        console.log('WS cerrado, reintentando...');
        setTimeout(() => { ws = connectSocket(); }, 1000);
    };

    ws.onerror = (err) => {
        console.error("WebSocket error:", err);
    };

    // Detectar clic en un chat
    $(document).on("click", ".user-chat", function () {
        selectedChatId = $(this).attr("id"); // Obtener el ID del chat seleccionado
         // Desplazar hacia abajo al seleccionar un chat
        if (!selectedChatId) {
            console.error("No se pudo obtener el ID del chat seleccionado.");
            return;
        }
        console.log("Chat seleccionado con ID:", selectedChatId);

        // Limpiar mensajes previos y cargar mensajes del chat seleccionado
        $("#messages").empty();
        getMessagesByChatId(selectedChatId, sessionStorage.token).then(messages => {
            messages.messages.forEach(message => {
                $("#messages").append(
                    `<div class="message">
                        <strong>${message.id_remitente == user.id ? user.nombre : "Empresa"}:</strong> ${message.mensaje}
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
            scrollToBottom();
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
            }
                
            $("#messageInput").val(''); // Limpiar el campo de entrada
            scrollToBottom(); // Desplazar hacia abajo al enviar un nuevo mensaje
        }).catch(err => {
            console.error("Error al guardar el mensaje:", err);
        });
    });
});