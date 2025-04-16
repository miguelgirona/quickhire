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

    function getOfertas(idEmpresa) {
        return $.ajax({  
          url: "https://miguelgirona.com.es/quickhire_api/public/ofertas/getOfertasByEmpresa/"+idEmpresa,
          method: "GET",
        });
    }
console.log(user);

    getEmpresa(user.id,sessionStorage.token).then(e => {
        let empresa = e[0];
        console.log(empresa);
        
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