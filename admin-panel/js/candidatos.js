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


    function getCandidatos(token){
        csrfToken = getCookie('csrf_cookie_name');

        return $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/candidatos',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'X-CSRF-Token': csrfToken
            }
        });
    }

    getCandidatos(sessionStorage.token).then(candidatos => {
        console.log(candidatos);
        $('#numero-candidatos').text(candidatos.length);
        $('#tabla').DataTable({
            data: candidatos,
            scrollX: true,
            columns: [
                { data: "id" },
                { data: 'id_usuario' },
                { data: 'nombre' },
                {
                    data: 'url_cv',
                    render: function(data){
                        return `<a href="${data}" target="_blank">Ver CV</a>`
                    }
                },
                { data: 'ciudad' },
                { data: 'pais' },
                {
                    data: 'updated_at',
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
                { 
                    data: null,
                    render: function(data, type, row){
                        return "<div class='actions'><svg xmlns='http://www.w3.org/2000/svg' class='action-icon view' id='ver-usuario-"+row.id_usuario+"' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'><path stroke-linecap='round' stroke-linejoin='round' d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z' /><path stroke-linecap='round' stroke-linejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' /></svg>"+
                        "<svg xmlns='http://www.w3.org/2000/svg' class='action-icon delete' id='eliminar-usuario-"+row.id_usuario+"' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'><path stroke-linecap='round' stroke-linejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' /></svg></div>"
                    }
                }
            ],
            responsive: true
        });

        //ver perfil completo del usuario
        $('#tabla').on('click', '.view', function() {
            const id = $(this).attr('id').split('-')[2];
            
            window.location.href = "https://miguelgirona.com.es/quickhire/admin-panel/pages/perfil-candidato?id="+id;
            
        });

        //eliminar usuario
        $('#tabla').on('click', '.delete', function() {
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