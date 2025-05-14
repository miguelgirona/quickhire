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


    function getEmpresasPorSector(token){
        csrfToken = getCookie('csrf_cookie_name');
            return $.ajax({
                url: 'https://miguelgirona.com.es/quickhire_api/public/empresas/empresasPorSector',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'X-CSRF-Token': csrfToken
            }
        });
    }

    function getEmpresasPorPlan(token){
        csrfToken = getCookie('csrf_cookie_name');
            return $.ajax({
                url: 'https://miguelgirona.com.es/quickhire_api/public/empresas/empresasPorPlan',
                type: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'X-CSRF-Token': csrfToken
            }
        });
    }

    getEmpresasPorSector(sessionStorage.token).then(empresas => {
        console.log(empresas);
        const ctx = $("#empresas-por-sector")

        const sectores = empresas.map(empresa => empresa.sector);
        const cantidades = empresas.map(empresa => empresa.cantidad);
        const colores = sectores.map(() => '#' + Math.floor(Math.random()*16777215).toString(16));


        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: sectores,
                datasets: [{
                    data: cantidades,
                    backgroundColor: colores
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Empresas por Sector'
                    }
                }
            }
        });
        
    });

    getEmpresasPorPlan(sessionStorage.token).then(empresas => {
        console.log(empresas);
        const ctx = $("#empresas-por-plan")

        const planes = empresas.map(empresa => empresa.plan);
        const cantidades = empresas.map(empresa => empresa.cantidad);
        const colores = planes.map(() => '#' + Math.floor(Math.random()*16777215).toString(16));


        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: planes,
                datasets: [{
                    data: cantidades,
                    backgroundColor: colores
                }]
            },
            options: {
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Empresas por Plan'
                    }
                }
            }
        });
        
    });

    function getEmpresas(token){
        csrfToken = getCookie('csrf_cookie_name');

        return $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/empresas',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'X-CSRF-Token': csrfToken
            }
        });
    }

    function getEmpresasSinValidar(token){
        csrfToken = getCookie('csrf_cookie_name');

        return $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/empresas/sinValidar',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'X-CSRF-Token': csrfToken
            }
        });
    }

    function getEmpresasSinActivar(token){
        csrfToken = getCookie('csrf_cookie_name');

        return $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/empresas/sinActivar',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'X-CSRF-Token': csrfToken
            }
        });
    }

    getEmpresas(sessionStorage.token).then(empresas => {
        console.log('Activadas', empresas);
        $('#numero-activas').text(empresas.length);
        $('#tabla-activas').DataTable({
            data: empresas,
            scrollX: true,
            columns: [
                { data: "id" },
                { data: 'id_usuario' },
                { data: 'identificacion' },
                { data: 'nombre_empresa' },
                {
                    data: 'descripcion',
                    render: function(data){
                        return data.substring(0, 50) + '...';
                    }
                },
                {
                    data: 'sitio_web',
                    render: function(data){
                        return `<a href="${data}" target="_blank">Ver sitio web</a>`;
                    }
                },
                {
                    data: 'fecha_validacion',
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
                { data: 'ciudad' },
                { data: 'pais' },
                { data: 'plan' },
                {
                    data: 'fecha_activacion',
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
        $('#tabla-activas').on('click', '.view', function() {
            const id = $(this).attr('id').split('-')[2];
            
            window.location.href = "https://miguelgirona.com.es/quickhire/admin-panel/pages/perfil-empresa?id="+id;
            
        });

        //eliminar usuario
        $('#tabla-activas').on('click', '.delete', function() {
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

    getEmpresasSinValidar(sessionStorage.token).then(empresas => {
        console.log('Sin validar', empresas);
        $('#numero-por-validar').text(empresas.length);
        $('#tabla-validar').DataTable({
            data: empresas,
            scrollX: true,
            columns: [
                { data: "id" },
                { data: 'id_usuario' },
                { data: 'identificacion' },
                { data: 'nombre_empresa' },
                {
                    data: 'descripcion',
                    render: function(data){
                        return data.substring(0, 50) + '...';
                    }
                },
                { data: 'plan' },
                { 
                    data: null,
                    render: function(data, type, row){  
                                         
                        return "<div class='actions'><svg xmlns='http://www.w3.org/2000/svg' class='action-icon view' data-mail='"+ row.mail +"' id='ver-usuario-"+row.id_usuario+"' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'><path stroke-linecap='round' stroke-linejoin='round' d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z' /><path stroke-linecap='round' stroke-linejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' /></svg>"+
                        "<svg xmlns='http://www.w3.org/2000/svg' class='action-icon delete' id='eliminar-usuario-"+row.id_usuario+"' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'><path stroke-linecap='round' stroke-linejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' /></svg></div>"
                    }
                }
            ],
            responsive: true
        });

        //eliminar empresa
        $('#tabla-validar').on('click', '.delete', function(){
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

        //ver detalles de empresa para validar
        $('#tabla-validar').on('click', '.view', function() {
            const id = $(this).attr('id').split('-')[2];
            const identificacion = $(this).closest('tr').find('td:nth-child(3)').text();
            const nombre = $(this).closest('tr').find('td:nth-child(4)').text();
            const destinatario = $(this).data('mail');            

            Swal.fire({
                icon: 'info',
                title: 'Información de nueva empresa',
                html:`
                    <div>
                        <h4>Identificación:</h4>
                        <p>${identificacion}</p>
                        <h4>Nombre de empresa:</h4>
                        <p>${nombre}</p>
                    </div>
                `,
                confirmButtonText: 'Validar empresa',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
            }).then(result => {
                
                if(result.isConfirmed){
                    
                    csrfToken = getCookie('csrf_cookie_name');

                    $.ajax({
                        url: "https://miguelgirona.com.es/quickhire_api/public/empresas/" + id,
                        method: "PUT",
                        contentType: 'application/json',
                        data: JSON.stringify({
                            validada: 1,
                        }),
                        headers: {
                            "Authorization": "Bearer " + sessionStorage.token,
                            'X-CSRF-TOKEN': csrfToken,
                        },
                        success: function(response) {
                            $.ajax({
                                url: 'https://miguelgirona.com.es/quickhire_api/public/correo/enviar',
                                type: 'POST',
                                data: {
                                    destinatario: destinatario,
                                    nombre: nombre,
                                    mensaje: 'Hola '+ nombre +',\n\n ¡Felicidades! hemos validado exitosamente tu cuenta de empresa, ya puedes iniciar sesión en QuickHire\n ¡Gracias por tu paciencia!.\n\nSaludos,\nEl equipo de QuickHire',
                                },
                                headers: {
                                    'X-CSRF-TOKEN': getCookie('csrf_cookie_name'),
                                },
                                success: function(response) {
                                    if (response.error) {
                                        alert('Error: ' + response.error);
                                    }
                                },
                                error: function(xhr) {
                                    console.log('Error inesperado: ' + xhr.responseText);
                                }
                            });
                            location.reload();
                        },
                        error: function(xhr, status, error) {
                            alert("Error al editar EMPRESA: " + error);
                            console.log(xhr.responseText); // Verifica la respuesta del servidor para detalles

                        }
                    });
                    
                }
                
            })
            
        });
    });

    getEmpresasSinActivar(sessionStorage.token).then(empresas => {
        console.log('Sin activar',empresas);
        $('#numero-por-activar').text(empresas.length);
        $('#tabla-activar').DataTable({
            data: empresas,
            scrollX: true,
            columns: [
                { data: "id" },
                { data: 'id_usuario' },
                { data: 'identificacion' },
                { data: 'nombre_empresa' },
                {
                    data: 'descripcion',
                    render: function(data){
                        return data.substring(0, 50) + '...';
                    }
                },
                {
                    data: 'sitio_web',
                    render: function(data){
                        return `<a href="${data}" target="_blank">Ver sitio web</a>`;
                    }
                },
                {
                    data: 'fecha_validacion',
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
                { data: 'ciudad' },
                { data: 'pais' },
                { data: 'plan' },
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
        $('#tabla-activar').on('click', '.view', function() {
            const id = $(this).attr('id').split('-')[2];
            
            window.location.href = "https://miguelgirona.com.es/quickhire/admin-panel/pages/perfil-empresa?id="+id;
            
        });

        //eliminar empresa
        $('#tabla-activar').on('click', '.delete', function(){
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