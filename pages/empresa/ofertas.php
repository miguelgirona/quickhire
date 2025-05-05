<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickHire - Mis Ofertas</title>
    <link rel="icon" href="/quickhire/assets/img/iconos/logo.png" type="image/png">
    <link rel="stylesheet" href="/quickhire/assets/css/menu.css">
    <link rel="stylesheet" href="/quickhire/assets/css/footer.css">
    <link rel="stylesheet" href="/quickhire/assets/css/empresa/mis-ofertas.css">
    <script src="/quickhire/assets/js/jquery.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="/quickhire/assets/js/main.js"></script>
    <script src="/quickhire/assets/js/empresa/mis-ofertas.js"></script>
</head>
<body>
    <div id="container">
        <?php include_once("../../includes/menu.php")?>
        <div id="content">
            <h1>Mis Ofertas</h1>
            <button id="nueva">Publicar Nueva Oferta</button>
            <div id="loading-candidaturas" style="text-align:center; margin-top: 20px;">
                <img src="/quickhire/assets/img/loading.gif" alt="Cargando..." style="width: 60px;">
            </div>
            <div id="ofertas"></div>
        </div>
        <?php include_once("../../includes/footer.php")?>
    </div>
    <div id="formulario-nueva-oferta" style="display: none; margin-top: 20px;">
    <h2>Publicar Nueva Oferta</h2>
    <form id="nueva-oferta-form">
        <label for="titulo">Título:</label>
        <input type="text" id="titulo" name="titulo" required>

        <label for="provincia">Provincia:</label>
        <select id="provincia" name="provincia" required>
            <option value="A Coruña">A Coruña</option>
            <option value="Álava">Álava</option>
            <option value="Albacete">Albacete</option>
            <option value="Alicante">Alicante</option>
            <option value="Almería">Almería</option>
            <option value="Asturias">Asturias</option>
            <option value="Ávila">Ávila</option>
            <option value="Badajoz">Badajoz</option>
            <option value="Barcelona">Barcelona</option>
            <option value="Bizkaia">Bizkaia</option>
            <option value="Burgos">Burgos</option>
            <option value="Cáceres">Cáceres</option>
            <option value="Cádiz">Cádiz</option>
            <option value="Cantabria">Cantabria</option>
            <option value="Castellón">Castellón</option>
            <option value="Ciudad Real">Ciudad Real</option>
            <option value="Córdoba">Córdoba</option>
            <option value="Cuenca">Cuenca</option>
            <option value="Gipuzkoa">Gipuzkoa</option>
            <option value="Girona">Girona</option>
            <option value="Granada">Granada</option>
            <option value="Guadalajara">Guadalajara</option>
            <option value="Huelva">Huelva</option>
            <option value="Huesca">Huesca</option>
            <option value="Illes Balears">Illes Balears</option>
            <option value="Jaén">Jaén</option>
            <option value="León">León</option>
            <option value="Lleida">Lleida</option>
            <option value="Lugo">Lugo</option>
            <option value="Madrid">Madrid</option>
            <option value="Málaga">Málaga</option>
            <option value="Murcia">Murcia</option>
            <option value="Navarra">Navarra</option>
            <option value="Ourense">Ourense</option>
            <option value="Palencia">Palencia</option>
            <option value="Las Palmas">Las Palmas</option>
            <option value="Pontevedra">Pontevedra</option>
            <option value="La Rioja">La Rioja</option>
            <option value="Salamanca">Salamanca</option>
            <option value="Santa Cruz de Tenerife">Santa Cruz de Tenerife</option>
            <option value="Segovia">Segovia</option>
            <option value="Sevilla">Sevilla</option>
            <option value="Soria">Soria</option>
            <option value="Tarragona">Tarragona</option>
            <option value="Teruel">Teruel</option>
            <option value="Toledo">Toledo</option>
            <option value="Valencia">Valencia</option>
            <option value="Valladolid">Valladolid</option>
            <option value="Zamora">Zamora</option>
            <option value="Zaragoza">Zaragoza</option>
        </select>

        <label for="experiencia_minima">Experiencia mínima</label>
        <select name="experiencia_minima" id="experiencia_minima">
            <option value="0">Sin experiencia</option>
            <option value="1">Al menos 1 año</option>
            <option value="2">Al menos 2 años</option>
            <option value="3">Al menos 3 años</option>
            <option value="4">Al menos 4 años</option>
            <option value="5">Al menos 5 años</option>
            <option value="6">Al menos 6 años o más</option>
        </select>

        <label for="jornada">Jornada</label>
        <select name="jornada" id="jornada">
            <option value="Completa">Completa</option>
            <option value="Indiferente">Indiferente</option>
            <option value="Parcial - Indiferente">Parcial - Indiferente</option>
            <option value="Parcial - Mañana">Parcial - Mañana</option>
            <option value="Intensiva - Mañana">Intensiva - Mañana</option>
            <option value="Parcial - Tarde">Parcial - Tarde</option>
            <option value="Intensiva - Indiferente">Intensiva - Indiferente</option>
            <option value="Intensiva - Tarde">Intensiva - Tarde</option>
            <option value="Intensiva - Noche">Intensiva - Noche</option>
            <option value="Parcial - Noche">Parcial - Noche</option>
        </select>

        <label for="tipo_contrato">Tipo Contrato</label>
        <select name="tipo_contrato" id="tipo_contrato">
            <option value="Indefinido">Indefinido</option>
            <option value="Temporal">Temporal</option>
            <option value="Otros contratos">Otros contratos</option>
            <option value="Fijo discontinuo">Fijo discontinuo</option>
            <option value="Autónomo">Autónomo</option>
            <option value="A tiempo parcial">A tiempo parcial</option>
            <option value="Formativo">Formativo</option>
            <option value="De relevo">De relevo</option>
        </select>

        <label for="modalidad">Modalidad</label>
        <select name="modalidad" id="modalidad">
            <option value="Presencial">Presencial</option>
            <option value="Teletrabajo">Teletrabajo</option>
            <option value="Híbrido">Híbrido</option>
        </select>

        <label for="fecha_cierre">Fecha de Cierre:</label>
        <input type="date" id="fecha_cierre" name="fecha_cierre" required>

        <p>Requisitos</p>
        <label for="estudios_minimos">Estudios mínimos</label>
        <select name="estudios_minimos" id="estudios_minimos">
            <option value="Sin Estudios">Sin Estudios</option>
            <option value="Secundaria Obligatoria">Secundaria Obligatoria</option>
            <option value="Bachillerato">Bachillerato</option>
            <option value="Grado Medio">Grado Medio</option>
            <option value="Grado Superior">Grado Superior</option>
            <option value="Grado Universitario">Grado Universitario</option>
            <option value="Máster">Máster</option>
            <option value="Doctorado">Doctorado</option>
        </select>

        <label for="descripcion">Descripción:</label>
        <textarea id="descripcion" name="descripcion" rows="4" required></textarea>

        <label for="sector">Sector</label>
        <select name="sector" id="sector"></select>

        <label for="salario_min">Salario Mínimo:</label>
        <input type="number" id="salario_min" name="salario_min" required>

        <label for="salario_max">Salario Máximo:</label>
        <input type="number" id="salario_max" name="salario_max" required>
    </form>
</div>
</body>
</html>