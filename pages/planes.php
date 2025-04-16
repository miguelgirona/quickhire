<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="En QuickHire ofrecemos planes de contratación adaptados a empresas de todos los tamaños. Desde el plan básico para pequeñas startups hasta el plan premium para grandes corporaciones, encuentra el que mejor se ajuste a tus necesidades y empieza a contratar hoy mismo.">
    <meta name="keywords" content="planes de contratación, QuickHire, empleo, ofertas de trabajo, contratación para empresas, plan básico, plan profesional, plan premium, empresas, startups, grandes empresas, encontrar talento, contratación rápida, oferta de empleo">
    <title>QuickHire - Selecciona el mejor plan para tu empresa</title>
    <link rel="icon" href="/quickhire/assets/img/iconos/logo.png" type="image/png">
    <link rel="stylesheet" href="assets/css/planes.css">
    <link rel="stylesheet" href="assets/css/menu.css">
    <link rel="stylesheet" href="assets/css/footer.css">
    <script src="assets/js/jquery.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="assets/js/planes.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../includes/menu.php")?>
        <div id="content">
            <h1>¡Selecciona el mejor plan para tu empresa!</h1>
            <p>En QuickHire contamos con planes de contratación diseñados para todo tipo de empresas, desde pequeñas startups hasta grandes corporaciones. Nuestros planes básico, profesional y premium se adaptan a tus necesidades, permitiéndote publicar ofertas de empleo y encontrar el talento ideal para hacer crecer tu negocio.</p>
            <div id="planes">
                <div id="basico">
                    <h2>Básico</h2>
                    <h4>Ideal para pequeñas empresas o startups que no contratan con mucha frecuencia.</h4>
                    <h5>49€/año</h5>
                    <button id="plan-basico" class="call-to-action">¡Empieza ahora!</button>
                    <ul>
                        <li>Hasta 5 ofertas de empleo al año</li>
                        <li>30 días activa tu oferta.</li>
                        <li>Visibilidad estándar, aparece en los resultados de búsqueda, sin prioridad</li>
                        <li>Contacto directo con los postulantes</li>
                        <li>Soporte básico vía correo electrónico</li>
                    </ul>
                </div>

                <div id="profesional">
                    <p>¡Popular!</p>
                    <h2>Profesional</h2>
                    <h4>Perfecto para empresas en crecimiento que buscan contratar con más frecuencia.</h4>
                    <h5>199€/año</h5>
                    <button id="plan-profesional" class="call-to-action">¡Empieza ahora!</button>
                    <ul>
                        <li>Hasta 15 ofertas de empleo al año</li>
                        <li>90 días activa tu oferta.</li>
                        <li>Visibilidad prioritaria frente al plan básico</li>
                        <li>Contacto directo con los postulantes y herramientas de filtrado</li>
                        <li>Soporte prioritario vía correo electrónico</li>
                    </ul>
                </div>
                <div id="premium">
                    <h2>Premium</h2>
                    <h4>Diseñado para grandes empresas o agencias con necesidades de contratación constante.</h4>
                    <h5>399€/año</h5>
                    <button id="plan-premium" class="call-to-action">¡Empieza ahora!</button>
                    <ul>
                        <li>Ofertas ilimitadas</li>
                        <li>Duración de la oferta ilimitada</li>
                        <li>Visibilidad prioritaria, aparece en las primeras posiciones y promoción en la página principal</li>
                        <li>Soporte prioritario vía correo electrónico y telefónico con asesor dedicado</li>
                    </ul>
                </div>
            </div>
        </div>
        <?php include_once("../includes/footer.php")?>
    </div>
</body>
</html>