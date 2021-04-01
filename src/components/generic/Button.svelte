<script>
    export let text = "";
    export let url = "";
    export let is_submit = false;
    export let target = "_blank";
    export let variante = 0;
    let modificador = [
        "Light",
        "Dark",
        "Colored",
        "ColoredInvert",
        "UnicodeIcon",
        "ScrollTo"
    ];
</script>

<style lang="scss">
    @use "../../sass/_index.scss" as *;

    button {
        background-color: transparent;
        user-select: none;
        &:focus {
            /* outline-width: 1px;
            outline-style: dotted;
            outline-color: unset;             */
            border: none;
        }
    }

    a,
    button {
        font-size: inherit;
        display: flex;
        align-items: center;
        padding: $h0 $h1;
        text-decoration: none;
        border-width: 1px;
        border-style: solid;
        border-radius: 4px;
        @include margin-top(1);
        @include margin-bottom(1);
        max-width: $h8;
        position: relative;
        &:after {
            font-size: $h2;
            padding-left: $h0;
        }
        &:hover {
            cursor: pointer;
        }
    }
    
    .Dark {
        color: $grey_5;
        border-color: $grey_5;
        &:hover {
            color: $grey_0;
            background-color: $quaternary;
            border-color: $quaternary;
        }
    }
    .Light {
        color: $grey_1;
        border-color: $grey_1;
        &:hover {
            color: $grey_5;
            background-color: $grey_1;
            border-color: $grey_1;
        }
    }
    .Colored {
        color: $grey_2;
        border-color: $grey_2;
        &:hover {
            color: $grey_5;
            background-color: $grey_0;
            border-color: $grey_0;
        }
    }
    .ColoredInvert {
        color: $grey_1;
        border-color: $grey_1;
        &:hover {
            color: $grey_5;
            background-color: $grey_0;
            border-color: $grey_0;
        }
    }
    .UnicodeIcon {
        color: $white;
        border: none;
        margin: 0;
        @include media(s2) {
            color: $highlight;
        }
        @include type-setting(2);
        &:hover {
            color: $grey_0;
        }
    }
    .ScrollTo {
        color: $black;
        border: none;
        text-align: center;
        margin: 0;

        @include type-setting(2);
        display: block;
        background-color: transparent;
        &:hover {
            color: $grey_0;
        }
    }
</style>

{#if url}
    <a href="{url}" target="{target}" class="{modificador[variante]}">
        {text}
    </a>
{:else if is_submit}
    <button on:click type="submit" class="{modificador[variante]}">
        {text}
    </button>
{:else}
    <button on:click class="{modificador[variante]}">
        {text}
    </button>
{/if}
