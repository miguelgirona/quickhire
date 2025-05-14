function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));        
    
    if (match) {
        return decodeURIComponent(match[2]);
    }
    return null;
}
var csrfToken = getCookie('csrf_cookie_name');

if(!sessionStorage.user){
    window.location.href = "https://miguelgirona.com.es/quickhire/admin-panel/login";
}
$(document).ready(function() {
    
    let user = JSON.parse(sessionStorage.user);

    if(user.tipo_usuario !== 'Administrador'){
        window.location.href = "https://miguelgirona.com.es/quickhire";
    }

    function getTotalUsuarios(tipo, token){
        csrfToken = getCookie('csrf_cookie_name');
        
        return $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios/total'+(tipo ? '?tipo=' + tipo : ''),
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            },
        });
    }

    function getUltimosUsuarios(token, limit){
        csrfToken = getCookie('csrf_cookie_name');
        
        return $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/usuarios?limit=' + limit,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                'X-CSRF-TOKEN': csrfToken,
            },
        });
    }

    function getTotalOfertas(){
        csrfToken = getCookie('csrf_cookie_name');

        return $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/ofertas/total',
            method: "GET",
            headers: {
                'X-CSRF-TOKEN': csrfToken,
            },
        });
    }

    getTotalOfertas().then(totalOfertas => {
        $("#total-jobs").text(totalOfertas);
    });

    getTotalUsuarios(null,sessionStorage.token).then(totalUsuarios => {
        $("#total-users").text(totalUsuarios);
        
    });

    getTotalUsuarios("Empresa",sessionStorage.token).then(totalUsuarios => {
        $("#total-companies").text(totalUsuarios);
        
    });

    getTotalUsuarios("Candidato",sessionStorage.token).then(totalUsuarios => {
        $("#total-cand").text(totalUsuarios);
        
    });

    getUltimosUsuarios(sessionStorage.token, 10).then(usuarios => {
        console.log(usuarios);
        $('#tabla').DataTable({
            data: usuarios,
            scrollX: true,
            order: [[3, "desc"]],
            columns: [
                { data: "id" },
                { data: 'nombre' },
                { data: 'mail' },
                {
                    data: 'created_at',
                    render: function(data, type, row) {
                        if (type === 'sort' || type === 'type') {
                            return new Date(data).getTime();
                        }
                        return new Date(data).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    }
                },
                { data: 'tipo_usuario' },
                { 
                    data: null,
                    render: function(data, type, row){
                        return "<div class='actions'><svg xmlns='http://www.w3.org/2000/svg' class='action-icon view' data-tipouser='"+row.tipo_usuario+"' id='ver-usuario-"+row.id+"' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'><path stroke-linecap='round' stroke-linejoin='round' d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z' /><path stroke-linecap='round' stroke-linejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' /></svg>"+
                        "<svg xmlns='http://www.w3.org/2000/svg' class='action-icon delete' id='eliminar-usuario-"+row.id+"' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'><path stroke-linecap='round' stroke-linejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' /></svg>"+
                        "<svg xmlns='http://www.w3.org/2000/svg' class='action-icon edit' id='editar-usuario-"+row.id+"' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'><path stroke-linecap='round' stroke-linejoin='round' d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10' /></svg></div>";
                    }
                }
            ],
            responsive: true
        });

        //ver perfil completo del usuario
        $('#tabla').on('click', '.view', function() {
            const id = $(this).attr('id').split('-')[2];
            const tipoUser = $(this).data('tipouser');
            
            if(tipoUser == 'Candidato') window.location.href = "https://miguelgirona.com.es/quickhire/admin-panel/pages/perfil-candidato?id="+id;
            
        });

        //edicion rapida
        $('#tabla').on('click', '.edit', async function(){
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

        //eliminar usuario
        $('#tabla').on('click', '.delete', function() {
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
});