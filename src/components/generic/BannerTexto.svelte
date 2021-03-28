<script>
    export let header = ""
    export let texto = ""
    export let img = ""
</script>

<style lang="scss">
    @use "../../sass/_index.scss" as *;

    .BannerTexto {
        position: relative;
        background-color: $white;
        display: grid;
        align-items: center;
        justify-items: center;
        text-align: center;
        padding: $h3;
        
        .BannerTextoHeader {
            margin-top: $h2;
            margin-bottom: $h2;
            color: $highlight_1;
        }
        .BannerTextoText {
            color: $grey_4;
            /* @include media(s2) {
                @include type-setting(1);
            } */
        }
        p {
            color: $grey_2;
        }
    }
    .Avatar {
        max-width: 200px;
        border-radius: 50%;
    }
</style>

<section class="BannerTexto">
    <img class="Avatar" src={img} alt="">
    <h2 class="BannerTextoHeader">
        {header} <br>
        <span class="BannerTextoText">{@html texto}</span>
    </h2>
    <p>
        Nací en Vic (Barcelona) en 1976.
    </p>

    <h3>1985-1991</h3> 
    <p>Durante mi infancia me formé en la Escola de dibuix i art Masferrer de Vic con los profesores Pere Isern Puntí, Eduard Xandri Calvet, Lluis Bres Oliva, Lluis Gros Pujol…</p>

    <h3>1994-1995</h3> <p>Estudié en Escola d´arts aplicades i oficis artistics de Vic.</p>

    <h3>1997-2001</h3> <p>Estudié el grado de Diseño de Moda en Escola Superior de Disseny Bau de Barcelona.</p> 

    <h3>2000-2001</h3> <p>Taller de sombrerería  en Barcelona  con Nina Pawloswsky.</p>

    <h3>1999 -2004</h3> <p>Empiezo a trabajar para la marca de moda para mujer Gimenez&Zuazo y su otra marca Boba by G&Z, con distribución en el mercado nacional e internacional en 250 puntos de venta canal multi marca en España, Francia, Italia, Japón...</p>
    <p>Bajo la dirección de los socios, co-dirijo el departamento de diseño. Me encargaba de todo el proceso de diseño y las ilustraciones, desarrollo de las colecciones, búsqueda de referencias y tendencias, diseño, elaboración y supervisión de fichas técnicas, coordinación con el equipo de patronaje, manejo de fornituras y materiales, coordinación con las empresas de estampación y producción.</p>  

    <h3>2004-2010</h3> <p>Directora creativa y socia fundadora de la marca de moda para mujer Obvia: desarrollo de la idea de negocio, dirección de la compañía con un equipo de personas, codirección del departamento de diseño, directora de producción, dirección de ventas. Distribución en el mercado nacional con puntos de venta canal multi marca en España. Fabricación de proximidad.</p>

    <h3>2010-2018</h3> <p>Freelance Textile Graphic Designer. Diseñadora de estampados para mujer, hombre, niñ@s  en Padma Diseño S.L., Zara, Pull&Bear, Bershka, Mango, Replay, Springfield, Blue Inc., Studio F Women / STF Group Colombia…</p>

    <h3>2019</h3> <p>Decido dejar el mundo de la moda y de la ilustración para empezar a buscar una expresión más íntima.</p>

    <p>Paralelamente a mi actividad profesional mantengo una formación continua en el mundo del arte, con incursiones en diversas técnicas como esmalte, cerámica, escultura, pintura al óleo, arte para niños, libros de artista, así como astrología y educación activa.</p>

    <p>Actualmente soy madre de dos hijos y, buscando formas alternativas de vida y educación, me trasladé en 2014 a un pequeño pueblo del Alt Penedès rodeado de viñedos y naturaleza.</p>
</section>