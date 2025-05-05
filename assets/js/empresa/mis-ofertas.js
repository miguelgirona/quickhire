$(document).ready(function(){
    $("#loading-candidaturas").show();

    function getCookie(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));        
        
        if (match) {
            return decodeURIComponent(match[2]);
        }
        return null;
    }
    var csrfToken = getCookie('csrf_cookie_name');

    if(sessionStorage.user ){
        if(JSON.parse(sessionStorage.user).tipo_usuario != "Empresa"){
            window.location.href = "https://miguelgirona.com.es/quickhire"
        }
        var user = JSON.parse(sessionStorage.user);
    }

    function getCandidaturas(idOferta){
        return $.ajax({  
            url: "https://miguelgirona.com.es/quickhire_api/public/candidaturas/getCandidaturasByOferta/"+idOferta,
            method: "GET",
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

    function getSectores() {
        return $.ajax({  
            url: "https://miguelgirona.com.es/quickhire_api/public/sectores",
            method: "GET",
        });
    }

    getSectores().then(sectores => {
        sectores.forEach(sector => {
            $("#sector").append("<option value='"+sector.id+"'>"+sector.sector+"</option>");
        });
    });

    function getOfertas(idEmpresa) {
        return $.ajax({  
          url: "https://miguelgirona.com.es/quickhire_api/public/ofertas/getOfertasByEmpresa/"+idEmpresa,
          method: "GET",
        });
    }

    getEmpresa(user.id,sessionStorage.token).then(e => {
        let empresa = e[0];
        console.log(empresa);
        
        // Abrir el modal al hacer clic en "Nueva"
        $("#nueva").click(function () {
            // Obtener el plan de la empresa
            const planEmpresa = empresa.plan; // Plan de la empresa
            const empresaId = empresa.id; // ID de la empresa

            // Obtener el número de ofertas publicadas
            getOfertas(empresaId).then(ofertas => {
                const totalOfertas = ofertas.length;
                console.log(ofertas);
                

                // Validar según el plan
                if ((planEmpresa === "Basico" && totalOfertas >= 5) ||
                    (planEmpresa === "Profesional" && totalOfertas >= 15)) {
                    Swal.fire(
                        "Límite alcanzado",
                        `Tu plan (${planEmpresa}) solo permite publicar ${planEmpresa === "Basico" ? 5 : 15} ofertas al año. Considera actualizar tu plan.`,
                        "warning"
                    );
                    return;
                }

                // Si no se ha alcanzado el límite, mostrar el formulario
                const fechaPublicacion = new Date();
                let fechaCierre;

                if (planEmpresa === "Basico") {
                    fechaCierre = new Date(fechaPublicacion);
                    fechaCierre.setDate(fechaPublicacion.getDate() + 30); // 30 días después
                } else if (planEmpresa === "Profesional") {
                    fechaCierre = new Date(fechaPublicacion);
                    fechaCierre.setDate(fechaPublicacion.getDate() + 90); // 90 días después
                } else if (planEmpresa === "Premium") {
                    fechaCierre = null; // Permitir cualquier fecha
                }

                // Establecer la fecha de cierre en el formulario
                if (fechaCierre) {
                    $("#fecha_cierre").val(fechaCierre.toISOString().split("T")[0]); // Formato yyyy-mm-dd
                    $("#fecha_cierre").prop("readonly", true); // Hacer que el campo sea de solo lectura
                } else {
                    $("#fecha_cierre").val(""); // Limpiar el campo
                    $("#fecha_cierre").prop("readonly", false); // Permitir edición
                }

                // Mostrar el diálogo modal
                $("#formulario-nueva-oferta").dialog({
                    modal: true,
                    width: 600,
                    buttons: {
                        "Guardar": function () {
                            // Recolectar los datos del formulario
                            const nuevaOferta = {
                                id_empresa: empresaId,
                                titulo: $("#titulo").val(),
                                provincia: $("#provincia").val(),
                                fecha_cierre: $("#fecha_cierre").val(),
                                requisitos: {
                                    estudios: $("#estudios_minimos").val(),
                                    experiencia: $("#experiencia_minima").val(),
                                    jornada: $("#jornada").val(),
                                    tipo_contrato: $("#tipo_contrato").val(),
                                    modalidad: $("#modalidad").val(),
                                },
                                descripcion: $("#descripcion").val(),
                                id_sector: $("#sector").val(),
                                salario_min: $("#salario_min").val(),
                                salario_max: $("#salario_max").val(),
                            };

                            // Enviar los datos al servidor
                            $.ajax({
                                url: "https://miguelgirona.com.es/quickhire_api/public/ofertas",
                                method: "POST",
                                headers: {
                                    "Authorization": "Bearer " + sessionStorage.token,
                                    'X-CSRF-TOKEN': csrfToken,
                                },
                                data: nuevaOferta,
                                success: function (response) {
                                    Swal.fire("¡Éxito!", "La oferta se ha creado correctamente.", "success");
                                    $("#formulario-nueva-oferta").dialog("close");
                                    $("#nueva-oferta-form")[0].reset();
                                    location.reload();
                                },
                                error: function (xhr, status, error) {
                                    Swal.fire("Error", "No se pudo crear la oferta. Inténtalo de nuevo.", "error");
                                    console.error(xhr.responseText);
                                },
                            });
                        },
                        "Cancelar": function () {
                            $(this).dialog("close");
                        }
                    }
                });
            });
        });

        getOfertas(empresa.id).then(ofertas => {
            let maxChars = window.innerWidth < 768 ? 50 : 175;
            ofertas.forEach(oferta => {
                getCandidaturas(oferta.id).then(candidaturas => {
                    if(ofertas.length == 0){
                        $("#ofertas").append("<p>¡Publica tu primera oferta!</p>")
                    } else {
                        $("#ofertas").append(
                            "<a href='/quickhire/empresa/oferta?id="+oferta.id+"'>"+
                                "<div class='oferta' data-id='"+oferta.id+"'>"+
                                    "<img src='"+user.url_imagen+"'>"+
                                    "<div>"+
                                        "<p class='inscritos'>Inscripciones: "+ Array.from(candidaturas).length +"</p>"+
                                        "<h2>"+ oferta.titulo +"</h2>"+
                                        "<p>"+(oferta.descripcion.length > maxChars ? oferta.descripcion.substring(0, maxChars) + "..." : oferta.descripcion)+"</p>"+
                                    "</div>"+
                                "</div>"+
                            "</a>"
                        );
                    }
                });
                
            });
            $("#loading-candidaturas").hide();
        });
    });
});