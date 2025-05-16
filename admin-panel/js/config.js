$(document).ready(function() {
    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));        
        
        if (match) {
            return decodeURIComponent(match[2]);
        }
        return null;
    }
    var csrfToken = getCookie('csrf_cookie_name');

    if(!sessionStorage.user){
        window.location.href = "https://miguelgirona.com.es/quickhire"
    }

    var user = JSON.parse(sessionStorage.user);
    const superAdmin = user.mail == "admin@admin.com"
    console.log(user);

    if(!superAdmin) $("#acciones, #nuevo-admin").remove();
    let columnas = [
        { data: "id" },
        { data: 'nombre' },
        { data: 'mail' }
    ];

    if (superAdmin) {
        columnas.push({
            data: null,
            render: function(data, type, row){
                return row.mail != "admin@admin.com" ? `
                    <div class='actions'>
                        <svg xmlns='http://www.w3.org/2000/svg' class='action-icon edit' id='editar-admin-${row.id}' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'>
                            <path stroke-linecap='round' stroke-linejoin='round' d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10' />
                        </svg>
                        <svg xmlns='http://www.w3.org/2000/svg' class='action-icon delete' id='eliminar-admin-${row.id}' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'>
                            <path stroke-linecap='round' stroke-linejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' />
                        </svg>
                    </div>
                `: "Super Administrador";
            }
        });
    }

    function getSectores(){
        csrfToken = getCookie('csrf_cookie_name');

        return $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/sectores',
            type: 'GET',
            headers: {
                'X-CSRF-Token': csrfToken
            }
        });
    }

    function getAdministradores(token){
        csrfToken = getCookie('csrf_cookie_name');

        return $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios/getAdministradores',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'X-CSRF-Token': csrfToken
            }
        });
    }

    function validatePassword(password) {
        var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
        return re.test(password);
    }

    $("#nuevo-admin").click(async function() {
        const { value: formValues } = await Swal.fire({
            title: "Nuevo Administrador",
            html: `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <label for="nombre" style="font-weight:bold;">Nombre</label>
                    <input id="nombre" class="swal2-input" placeholder="Nombre"></br>

                    <label for="mail" style="font-weight:bold;">Correo electrónico</label>
                    <input id="mail" type="email" class="swal2-input" placeholder="correo@gmail.com">

                    <label for="password" style="font-weight:bold;">Contraseña</label>
                    <input id="password" type="password" class="swal2-input" placeholder="******">

                    <label for="password2" style="font-weight:bold;">Repite la contraseña</label>
                    <input id="password2" type="password" class="swal2-input" placeholder="******">

                </div>
            `,
            focusConfirm: false,
            confirmButtonText: "Crear",
            showCancelButton: true,
            preConfirm: () => {
                if($("#password").val().trim() != $("#password2").val().trim()){
                    return Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Las contraseñas no coinciden"
                    });
                }

                if(!validatePassword($("#password").val())){
                    return Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "La contraseña debe tener al menos 6 caracteres, incluir letras mayúsculas, minúsculas, números y caracteres especiales."
                    });
                }

                return [
                    $("#nombre").val().trim(),
                    $("#mail").val().trim(),
                    $("#password").val().trim()
                ];
            }
        });
            
        if (formValues) {
            csrfToken = getCookie('csrf_cookie_name');
            
            $.ajax({
                url: "https://miguelgirona.com.es/quickhire_api/public/usuarios",
                method: "POST",
                credentials: 'include',
                data: {
                    nombre: formValues[0],
                    mail: formValues[1],
                    contraseña: formValues[2],
                    url_imagen:"https://miguelgirona.com.es/quickhire/qh-admin/uploads/default/candidato-default.png",
                    tipo_usuario: "Administrador"
                },
                headers: {
                    "Authorization": "Bearer " + sessionStorage.token,
                    'X-CSRF-TOKEN': csrfToken,
                },
                success: function(response) {
                    console.log(response);
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario administrador creado',
                        text: 'El usuario ha sido creado correctamente',
                    });
                    location.reload();
                },
                error: function(xhr, status, error) {
                    csrfToken = getCookie('csrf_cookie_name');
                    const response = xhr.responseText;                    
                    try {
                        const json = JSON.parse(response);
                        if (response.includes("Usuario existente")) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Correo duplicado',
                                text: 'Ese correo ya está en uso por otro usuario.',
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: 'Error al crear el usuario',
                                footer: `<pre>${json.message}</pre>`
                            });
                        }
                    } catch (e) {
                        // Si no se puede parsear como JSON
                        Swal.fire({
                            icon: 'error',
                            title: 'Error inesperado',
                            text: 'No se pudo procesar la respuesta del servidor.',
                            footer: `<pre>${xhr.responseText}</pre>`
                        });
                    }

                }
            });
        }
    });

    $("#nuevo-sector").click(async function() {
        const { value: formValues } = await Swal.fire({
            title: "Nuevo Sector",
            html: `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <label for="nombre" style="font-weight:bold;">Sector</label>
                    <input required id="nombre" class="swal2-input" placeholder="Nombre del sector"></br>
                </div>
            `,
            focusConfirm: false,
            confirmButtonText: "Crear",
            showCancelButton: true,
            preConfirm: () => {

                return [
                    $("#nombre").val().trim(),
                ];
            }
        });
            
        if (formValues) {
            csrfToken = getCookie('csrf_cookie_name');
            
            $.ajax({
                url: "https://miguelgirona.com.es/quickhire_api/public/sectores",
                method: "POST",
                credentials: 'include',
                data: {
                    sector: formValues[0],
                },
                headers: {
                    "Authorization": "Bearer " + sessionStorage.token,
                    'X-CSRF-TOKEN': csrfToken,
                },
                success: function(response) {
                    console.log(response);
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Sector creado',
                        text: 'El sector ha sido creado correctamente',
                    });
                    location.reload();
                },
                error: function(xhr, status, error) {
                    csrfToken = getCookie('csrf_cookie_name');

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se ha podido crear el sector.',
                    });

                }
            });
        }
    });

    getAdministradores(sessionStorage.token).then(admins => {
        console.log(admins);
        $("#numero-admins").text(admins.length);
        $("#tabla-admins").DataTable({
            data: admins,
            scrollX: true,
            columns: columnas,
            responsive: true
        });

        //editar administrador
        $('#tabla-admins').on('click', '.edit', async function(){
            const id = $(this).attr('id').split('-')[2];
            const nombre = $(this).closest('tr').find('td:nth-child(2)').text();
            const mail = $(this).closest('tr').find('td:nth-child(3)').text();

            const { value: formValues } = await Swal.fire({
                title: "Edición rápida",
                html: `
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <label for="nombre" style="font-weight:bold;">Nombre</label>
                        <input id="nombre" class="swal2-input" placeholder="Nombre" value="${nombre}"></br>

                        <label for="mail" style="font-weight:bold;">Correo electrónico</label>
                        <input id="mail" type="email" class="swal2-input" placeholder="correo@gmail.com" value="${mail}">
                    </div>
                `,
                focusConfirm: false,
                confirmButtonText: "Editar",
                preConfirm: () => {
                    return [
                        $("#nombre").val(),
                        $("#mail").val()
                    ];
                }
            });
            
            if (formValues) {
                csrfToken = getCookie('csrf_cookie_name');
                
                $.ajax({
                    url: "https://miguelgirona.com.es/quickhire_api/public/usuarios/" + id,
                    method: "PUT",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        nombre: formValues[0],
                        mail: formValues[1],
                    }),
                    headers: {
                        "Authorization": "Bearer " + sessionStorage.token,
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    success: function(response) {
                        console.log(response);
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuario editado',
                            text: 'El usuario ha sido editado correctamente',
                        });
                        location.reload();
                    },
                    error: function(xhr, status, error) {
                        csrfToken = getCookie('csrf_cookie_name');
                        const response = xhr.responseText;

                        try {
                            const json = JSON.parse(response);
                            if (json.message && json.message.includes("Duplicate entry") && json.message.includes("for key 'mail'")) {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Correo duplicado',
                                    text: 'Ese correo ya está en uso por otro usuario.',
                                });
                            } else {
                                Swal.fire({
                                    icon: 'error',
                                    title: 'Error',
                                    text: 'Error al editar el usuario',
                                    footer: `<pre>${json.message}</pre>`
                                });
                            }
                        } catch (e) {
                            // Si no se puede parsear como JSON
                            Swal.fire({
                                icon: 'error',
                                title: 'Error inesperado',
                                text: 'No se pudo procesar la respuesta del servidor.',
                                footer: `<pre>${xhr.responseText}</pre>`
                            });
                        }

                        console.error(xhr.responseText);

                    }
                });
            }

        });

        //eliminar administrador
        $("#tabla-admins").on('click', '.delete', function(){            
            const id = $(this).attr('id').split('-')[2];

            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarlo'
            }).then((result) => {
                if(result.isConfirmed){
                    csrfToken = getCookie('csrf_cookie_name');

                    $.ajax({
                        url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios/' + id,
                        type: 'DELETE',
                        headers: {
                            "Authorization": "Bearer " + sessionStorage.token,
                            'X-CSRF-TOKEN': csrfToken,
                        },
                        success: function (response) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Usuario eliminado',
                                text: 'El usuario ha sido eliminado correctamente',
                            });
                            location.reload();
                        },
                        error: function (xhr, status, error) {
                            console.log(xhr.responseText);
                        }
                    });
                        
                    
                }
            });
        });
    });

    getSectores().then(sectores => {
        console.log(sectores);
        $('#numero-sectores').text(sectores.length);
        $('#tabla-sectores').DataTable({
            data: sectores,
            scrollX: true,
            columns: [
                { data: "id" },
                { data: 'sector' },
                {
                    data: 'updated_at',
                    render: function(data, type, row) {
                        if (type === 'sort' || type === 'type') {
                            return new Date(data).getTime();
                        }
                        return data != null ? new Date(data).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        }) : "Sin actualizaciones";
                    }
                },
                { 
                    data: null,
                    render: function(data, type, row){
                        return "<div class='actions'><svg xmlns='http://www.w3.org/2000/svg' class='action-icon edit' id='editar-sector-"+row.id+"' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'><path stroke-linecap='round' stroke-linejoin='round' d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10' /></svg>"+
                        "<svg xmlns='http://www.w3.org/2000/svg' class='action-icon delete' id='eliminar-sector-"+row.id+"' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'><path stroke-linecap='round' stroke-linejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' /></svg></div>"
                    }
                }
            ],
            responsive: true
        });

        //edicion sector
        $('#tabla-sectores').on('click', '.edit', async function(){
            const id = $(this).attr('id').split('-')[2];
            const sector = $(this).closest('tr').find('td:nth-child(2)').text();

            const { value: formValues } = await Swal.fire({
                title: "Edición rápida",
                html: `
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <label for="sector" style="font-weight:bold;">Sector</label>
                        <input id="sector" class="swal2-input" placeholder="Nombre del sector" value="${sector}"></br>
                    </div>
                `,
                focusConfirm: false,
                confirmButtonText: "Editar",
                preConfirm: () => {
                    return [
                        $("#sector").val(),
                    ];
                }
            });
            
            if (formValues) {
                csrfToken = getCookie('csrf_cookie_name');
                
                $.ajax({
                    url: "https://miguelgirona.com.es/quickhire_api/public/sectores/" + id,
                    method: "PUT",
                    contentType: 'application/json',
                    data: JSON.stringify({
                        sector: formValues[0],
                    }),
                    headers: {
                        "Authorization": "Bearer " + sessionStorage.token,
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    success: function(response) {
                        console.log(response);
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Sector editado',
                            text: 'El sector ha sido editado correctamente',
                        });
                        location.reload();
                    },
                    error: function(xhr, status, error) {
                        csrfToken = getCookie('csrf_cookie_name');

                        Swal.fire({
                            icon: 'error',
                            title: 'Error inesperado',
                            text: 'No se pudo procesar la respuesta del servidor.',
                            footer: `<pre>${xhr.responseText}</pre>`
                        });
                        
                        console.error(xhr.responseText);

                    }
                });
            }

        });

        //eliminar sector
        $('#tabla-sectores').on('click', '.delete', function() {
            const id = $(this).attr('id').split('-')[2];

            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esta acción.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminarlo'
            }).then((result) => {
                if(result.isConfirmed){
                    csrfToken = getCookie('csrf_cookie_name');

                    $.ajax({
                        url: 'https://miguelgirona.com.es/quickhire_api/public/sectores/' + id,
                        type: 'DELETE',
                        headers: {
                            "Authorization": "Bearer " + sessionStorage.token,
                            'X-CSRF-TOKEN': csrfToken,
                        },
                        success: function (response) {
                            Swal.fire({
                                icon: 'success',
                                title: 'sector eliminado',
                                text: 'El sector ha sido eliminado correctamente',
                            });
                            location.reload();
                        },
                        error: function (xhr, status, error) {
                            console.log(xhr.responseText);
                            if(xhr.responseText.includes("foreign key constraint")){
                                Swal.fire({
                                    icon: 'error',
                                    title: "Error al eliminar el sector",
                                    text: "No puedes eliminar un sector que una empresa use"
                                })
                            }
                        }
                    });
                        
                    
                }
            });
        });
    });

});