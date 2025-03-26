$(document).ready(function(){
    $("#plan-basico").click(function(){
        window.location="empresas?basico";
    })

    $("#plan-profesional").click(function(){
        window.location="empresas?profesional";
    })

    $("#plan-premium").click(function(){
        window.location="empresas?premium";
    })
});