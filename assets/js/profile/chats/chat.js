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

    // → Pusher: inicialización del cliente
    // Asegúrate de haber incluido en tu HTML:
    // <script src="https://js.pusher.com/7.2/pusher.min.js"></script>
    Pusher.logToConsole = true;
    var pusher = new Pusher('6cdc8e60b7e31ff23fb2', {
        cluster: 'eu',
        encrypted: true
    });

    // Cargamos los chats y suscribimos a canales Pusher
    getCandidato(user.id, sessionStorage.token).then(c => {
        let candidato = c[0];
        console.log("Candidato: ", candidato);

        getChats(candidato.id, sessionStorage.token).then(chats => {
            chats.forEach(chat => {
                // → Pusher: suscripción al canal de este chat
                var channel = pusher.subscribe('chat.' + chat.id);
                channel.bind('new-message', data => {
                    if (data.id_chat != selectedChatId) return;
                    let html = `<strong>${data.sender}:</strong> `;
                    
                    // Texto
                    if (data.message) {
                        html += data.message;
                    }
                    
                    // Archivo
                    if (data.fileUrl) {
                        // Detectar extensión de imagen
                        const ext = data.fileUrl.split('.').pop().toLowerCase();
                        const imageExts = ['png','jpg','jpeg','gif','bmp','webp'];
                        
                        if (imageExts.includes(ext)) {
                            // Si es imagen, embébela
                            html += `<br/><img src="${data.fileUrl}" style="max-width:200px; max-height:200px; border-radius:4px;" alt="Imagen enviada"/>`;
                        } else {
                            // Si no, como enlace
                            html += `<br/><a href="${data.fileUrl}" target="_blank">📎 Ver archivo</a>`;
                        }
                    }
                    
                    // Timestamp
                    html += `<div class="timestamp">${new Date(data.timestamp).toLocaleDateString('es-ES', {
                        day: "2-digit", month: "2-digit", year: "numeric",
                        hour: "2-digit", minute: "2-digit"
                    })}</div>`;
                
                    $("#messages").append(`<div class="message">${html}</div>`);
                    scrollToBottom();
                });
                
                

                // Código original para poblar la lista de chats
                getEmpresa(chat.id_empresa).then(e => {
                    let empresa = e[0];
                    getUsuario(empresa.id_usuario, sessionStorage.token).then(usuario => {
                        $("#chats").append(
                            `<div class='user-chat' id='${chat.id.trim()}'>
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

    function scrollToBottom() {
        var messagesContainer = $("#messages");
        messagesContainer.scrollTop(messagesContainer[0].scrollHeight);
    }

    // Detectar clic en un chat
    $(document).on("click", ".user-chat", function () {
        selectedChatId = $(this).attr("id"); // Obtener el ID del chat seleccionado
        if (!selectedChatId) {
            console.error("No se pudo obtener el ID del chat seleccionado.");
            return;
        }
        console.log("Chat seleccionado con ID:", selectedChatId);

        // Limpiar mensajes previos y cargar mensajes del chat seleccionado
        $("#messages").empty();
        getMessagesByChatId(selectedChatId, sessionStorage.token).then(res => {
            res.messages.forEach(msg => {
                let html = `<strong>${msg.id_remitente == user.id ? user.nombre : "Empresa"}:</strong> `;
                
                // Texto
                if (msg.mensaje) {
                    html += msg.mensaje;
                }
        
                // Archivo
                if (msg.url_archivo) {
                    const ext = msg.url_archivo.split('.').pop().toLowerCase();
                    const imageExts = ['png','jpg','jpeg','gif','bmp','webp'];
                    
                    if (imageExts.includes(ext)) {
                        html += `<br/><img src="${msg.url_archivo}" style="max-width:200px; max-height:200px; border-radius:4px;" alt="Imagen enviada"/>`;
                    } else {
                        html += `<br/><a href="${msg.url_archivo}" target="_blank">📎 Ver archivo</a>`;
                    }
                }
        
                html += `<div class="timestamp">${new Date(msg.fecha_envio).toLocaleDateString('es-ES', {
                    day: "2-digit", month: "2-digit", year: "numeric",
                    hour: "2-digit", minute: "2-digit"
                })}</div>`;
        
                $("#messages").append(`<div class="message">${html}</div>`);
            });
            scrollToBottom();
        });
        
    });

    // Enviar mensaje
    $("#sendMessage").on("click", function () {
        if (!selectedChatId) {
            return alert("Por favor, selecciona un chat antes de enviar un mensaje.");
        }
    
        const messageContent = $("#messageInput").val().trim();
        const file = $("#fileInput")[0].files[0];
    
        if (!messageContent && !file) {
            return alert("Debe haber un texto o un archivo para enviar.");
        }
    
        // Preparamos FormData en lugar de JSON
        const fd = new FormData();
        fd.append("id_chat", selectedChatId);
        fd.append("id_remitente", user.id);
        if (messageContent) fd.append("mensaje", messageContent);
        if (file)           fd.append("archivo", file);
    
        $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/mensajes/save",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.token,
                "X-CSRF-TOKEN": getCookie("csrf_cookie_name")
            },
            data: fd,
            processData: false,  // importante para FormData
            contentType: false   // importante para FormData
        })
        .done(() => {
            $("#messageInput").val("");
            $("#fileInput").val("");
        })
        .fail(err => console.error("Error al guardar el mensaje:", err));
    });
    
});
