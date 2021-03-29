<script>
    export let header = ""
    export let texto = ""
    export let img = ""
    let idioma_switch = true;

</script>

<style lang="scss">
    @use "../../sass/_index.scss" as *;

    .BannerTexto {
        position: relative;
        background-color: $white;
        display: grid;
        align-items: center;
        text-align: center;
        padding: $h3;
        
        .BannerTextoHeader {
            max-width: $h9;
            margin-top: $h2;
            margin-bottom: $h2;
            color: $highlight_1;
            margin-left: auto;
            margin-right: auto;
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
        justify-self: center;
        max-width: 200px;
        border-radius: 50%;
    }
    .idioma_switch {
        position: relative;
        margin-bottom: $h1;
        display: flex;
        justify-items: flex-end;
        button:nth-child(1) {
            position: absolute;
            right: 0;
            top: 0;
            border: none;
            background-color: transparent;
            color: $highlight;
            &:hover {
                color: $grey_2;
                cursor: pointer;
            }
        }
    }
</style>

<section class="BannerTexto">

    <img class="Avatar" src={img} alt="">

    <h2 class="BannerTextoHeader">
        {header} <br>
        <span class="BannerTextoText">{@html texto}</span>
    </h2>

    <div class="idioma_switch">
        <button on:click={()=>{
            idioma_switch = !idioma_switch;
            console.log(idioma_switch)
        }}>{#if idioma_switch}English{:else}Español{/if}</button>
    </div>

    {#if idioma_switch}
    <dl>
        <dt>Nací en Vic (Barcelona) en 1976.</dt>
    
        <dt>1985-1991</dt>
        <dd>Durante mi infancia me formé en la <i>Escola de dibuix i art Masferrer</i> de Vic con los profesores Pere Isern Puntí, Eduard Xandri Calvet, Lluis Bres Oliva, Lluis Gros Pujol...</dd>
    
        <dt>1994-1995</dt>
        <dd>Estudié en <i>Escola d´arts aplicades i oficis artistics</i> de Vic.</dd>
    
        <dt>1997-2001</dt> 
        <dd>Estudié el grado de Diseño de Moda en <i>Escola Superior de Disseny Bau</i> de Barcelona.</dd> 
    
        <dt>2000-2001</dt> 
        <dd>Taller de sombrerería  en Barcelona con <i>Nina Pawloswsky</i>.</dd>
    
        <dt>1999 -2004</dt> 
        <dd>Empiezo a trabajar para la marca de moda para mujer <i>Gimenez&Zuazo</i> y su otra marca <i>Boba by G&Z</i>, con distribución en el mercado nacional e internacional en 250 puntos de venta canal multi marca en España, Francia, Italia, Japón...</dd>
        <dd>Bajo la dirección de los socios, co-dirijo el departamento de diseño. Me encargaba de todo el proceso de diseño y las ilustraciones, desarrollo de las colecciones, búsqueda de referencias y tendencias, diseño, elaboración y supervisión de fichas técnicas, coordinación con el equipo de patronaje, manejo de fornituras y materiales, coordinación con las empresas de estampación y producción.</dd>  
    
        <dt>2004-2010</dt> 
        <dd>Directora creativa y socia fundadora de la marca de moda para mujer <i>Obvia</i>: desarrollo de la idea de negocio, dirección de la compañía con un equipo de personas, codirección del departamento de diseño, directora de producción, dirección de ventas. Distribución en el mercado nacional con puntos de venta canal multi marca en España. Fabricación de proximidad.</dd>
    
        <dt>2010-2018</dt> 
        <dd>Freelance Textile Graphic Designer. Diseñadora de estampados para mujer, hombre, niñ@s en <i>Padma Diseño S.L., Zara, Pull&Bear, Bershka, Mango, Replay, Springfield, Blue Inc., Studio F Women / STF Group Colombia</i>...</dd>
    
        <dt>2019</dt> 
        <dd>Decido dejar el mundo de la moda y de la ilustración para empezar a buscar una expresión más íntima.</dd>
    
        <dd>Paralelamente a mi actividad profesional mantengo una formación continua en el mundo del arte, con incursiones en diversas técnicas como esmalte, cerámica, escultura, pintura al óleo, arte para niños, libros de artista, así como astrología y educación activa.</dd>
    
        <dt>Actualmente vivo en pareja con el artista multidisciplinar Sergio Forés. Soy madre de dos hijos y, buscando formas alternativas de vida y educación, me trasladé en 2014 a un pequeño pueblo del Alt Penedès rodeado de viñedos y naturaleza.</dt>
    </dl>
    {:else}
    <dl>
        <dt>I was born in Vic (Barcelona) in 1976.</dt>
    
        <dt>1985-1991</dt>
        <dd>in my childhood... me formé en la Escola de dibuix i art Masferrer de Vic con los profesores Pere Isern Puntí, Eduard Xandri Calvet, Lluis Bres Oliva, Lluis Gros Pujol…</dd>
    
        <dt>1994-1995</dt>
        <dd>Estudié en Escola d´arts aplicades i oficis artistics de Vic.</dd>
    
        <dt>1997-2001</dt> 
        <dd>Estudié el grado de Diseño de Moda en Escola Superior de Disseny Bau de Barcelona.</dd> 
    
        <dt>2000-2001</dt> 
        <dd>Taller de sombrerería  en Barcelona  con Nina Pawloswsky.</dd>
    
        <dt>1999 -2004</dt> 
        <dd>Empiezo a trabajar para la marca de moda para mujer Gimenez&Zuazo y su otra marca Boba by G&Z, con distribución en el mercado nacional e internacional en 250 puntos de venta canal multi marca en España, Francia, Italia, Japón...</dd>
        <dd>Bajo la dirección de los socios, co-dirijo el departamento de diseño. Me encargaba de todo el proceso de diseño y las ilustraciones, desarrollo de las colecciones, búsqueda de referencias y tendencias, diseño, elaboración y supervisión de fichas técnicas, coordinación con el equipo de patronaje, manejo de fornituras y materiales, coordinación con las empresas de estampación y producción.</dd>  
    
        <dt>2004-2010</dt> 
        <dd>Directora creativa y socia fundadora de la marca de moda para mujer Obvia: desarrollo de la idea de negocio, dirección de la compañía con un equipo de personas, codirección del departamento de diseño, directora de producción, dirección de ventas. Distribución en el mercado nacional con puntos de venta canal multi marca en España. Fabricación de proximidad.</dd>
    
        <dt>2010-2018</dt> 
        <dd>Freelance Textile Graphic Designer. Diseñadora de estampados para mujer, hombre, niñ@s  en Padma Diseño S.L., Zara, Pull&Bear, Bershka, Mango, Replay, Springfield, Blue Inc., Studio F Women / STF Group Colombia…</dd>
    
        <dt>2019</dt> 
        <dd>Decido dejar el mundo de la moda y de la ilustración para empezar a buscar una expresión más íntima.</dd>
    
        <dd>Paralelamente a mi actividad profesional mantengo una formación continua en el mundo del arte, con incursiones en diversas técnicas como esmalte, cerámica, escultura, pintura al óleo, arte para niños, libros de artista, así como astrología y educación activa.</dd>
    
        <dd>Actualmente vivo en pareja con el artista multidisciplinar Sergio Forés. Soy madre de dos hijos y, buscando formas alternativas de vida y educación, me trasladé en 2014 a un pequeño pueblo del Alt Penedès rodeado de viñedos y naturaleza.</dd>
    </dl>    
    {/if}
</section>