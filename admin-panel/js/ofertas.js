$(document).ready(function(){

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

    function getOfertas(){
        return $.ajax({
            url: "https://miguelgirona.com.es/quickhire_api/public/ofertas",
            method: "GET",
        });
        
    }

    function ofertasPorSector(token){
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/ofertas/ofertasPorSector',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'X-CSRF-Token': csrfToken
            }
        });
    }

    function ofertasPorEmpresa(token){
        csrfToken = getCookie('csrf_cookie_name');
        return $.ajax({
            url: 'https://miguelgirona.com.es/quickhire_api/public/ofertas/ofertasPorEmpresa',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'X-CSRF-Token': csrfToken
            }
        });
    }

    ofertasPorEmpresa(sessionStorage.token).then(ofertas => {
        const ctx = $("#ofertas-por-empresa")

        const empresas = ofertas.map(oferta => oferta.nombre_empresa);
        const cantidades = ofertas.map(oferta => oferta.cantidad);
        const colores = empresas.map(() => '#' + Math.floor(Math.random()*16777215).toString(16));

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: empresas,
                datasets: [{
                    label: 'Cantidad de ofertas',
                    data: cantidades,
                    backgroundColor: colores,
                    borderRadius: 10,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Empresas con más ofertas publicadas'
                    }
                }
            }
        });
        
    });

    ofertasPorSector(sessionStorage.token).then(ofertas => {
        console.log(ofertas);
        const ctx = $("#ofertas-por-sector")

        const sectores = ofertas.map(oferta => oferta.sector);
        const cantidades = ofertas.map(oferta => oferta.cantidad);
        const colores = sectores.map(() => '#' + Math.floor(Math.random()*16777215).toString(16));

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sectores,
                datasets: [{
                    label: 'Cantidad de ofertas',
                    data: cantidades,
                    backgroundColor: colores,
                    borderRadius: 10,
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Sectores con más ofertas'
                    }
                }
            }
        });
        
    });

    getOfertas().then(ofertas => {
        console.log(ofertas);

        $('#numero-ofertas').text(ofertas.data.length);
        $('#tabla-ofertas').DataTable({
            data: ofertas.data,
            scrollX: true,
            columns: [
                { data: "id" },
                { data: 'nombre_empresa' },
                { data: 'titulo' },
                { data: 'provincia' },
                {
                    data: 'fecha_publicacion',
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
                    data: 'fecha_cierre',
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
                    data: 'descripcion',
                    render: function(data){
                        return data.substring(0, 50) + '...';
                    }
                },
                {
                    data: 'nombre_sector',
                    render: function(data) {
                        return data || "Sin datos"
                    }
                },
                {
                    data: 'salario_min',
                    render: function(data) {
                        return data || "Sin datos"
                    }
                },
                {
                    data: 'salario_max',
                    render: function(data) {
                        return data || "Sin datos"
                    }
                },
                { 
                    data: null,
                    render: function(data, type, row){
                        return "<div class='actions'><svg xmlns='http://www.w3.org/2000/svg' class='action-icon view' id='ver-oferta-"+row.id+"' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'><path stroke-linecap='round' stroke-linejoin='round' d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z' /><path stroke-linecap='round' stroke-linejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' /></svg>"+
                        "<svg xmlns='http://www.w3.org/2000/svg' class='action-icon delete' data-oferta="+row.titulo+" data-nombre="+row.nombre_empresa+" data-mail="+row.email_empresa+" id='eliminar-oferta-"+row.id+"' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' width='20px'><path stroke-linecap='round' stroke-linejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' /></svg></div>"
                    }
                }
            ],
            responsive: true
        });

        //ver oferta
        $('#tabla-ofertas').on('click', '.view', function() {
            const id = $(this).attr('id').split('-')[2];

            window.location.href = "/quickhire/admin-panel/pages/ver-oferta?id=" + id;
        });

        //eliminar oferta
        $('#tabla-ofertas').on('click', '.delete', async function() {
            const id = $(this).attr('id').split('-')[2];
            const nombre = $(this).data('nombre');
            const destinatario = $(this).data('mail');
            const nombre_oferta = $(this).data('oferta');

            const { value: formValues } = await Swal.fire({
                title: "Eliminar oferta",
                html: `
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <label for="nombre" style="font-weight:bold;">Motivo</label>
                        <textarea swal2-input id="motivo" placeholder="Escribe el motivo por el cual vas a eliminar la oferta para notificar a la empresa"></textarea>
                    </div>
                `,
                focusConfirm: false,
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                confirmButtonText: "Eliminar",
                preConfirm: () => {
                    return [
                        $("#motivo").val(),
                    ];
                }
            });
            
            if (formValues) {
                csrfToken = getCookie('csrf_cookie_name');
                
                $.ajax({
                    url: "https://miguelgirona.com.es/quickhire_api/public/ofertas/" + id,
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + sessionStorage.token,
                        'X-CSRF-TOKEN': csrfToken,
                    },
                    success: function(response) {
                        csrfToken = getCookie('csrf_cookie_name');
                        console.log(response);
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Oferta eliminada',
                            text: 'El usuario ha sido editado correctamente',
                        });
                        $.ajax({
                            url: 'https://miguelgirona.com.es/quickhire_api/public/correo/enviar',
                            type: 'POST',
                            data: {
                                destinatario: destinatario,
                                nombre: nombre,
                                mensaje: 'Hola '+ nombre +',\n\n Desde QuickHire lamentamos comunicarte que hemos eliminado tu oferta "'+nombre_oferta+'" por el siguiente motivo: \n'+formValues[0]+'\n\nSaludos,\nEl equipo de QuickHire',
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
                        csrfToken = getCookie('csrf_cookie_name');
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Error al editar el usuario',
                            footer: `<pre>${json.message}</pre>`
                        });
                        console.error(xhr.responseText);

                    }
                });
            }
        });

    });

});