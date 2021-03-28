<script>

</script>
<style lang="scss">
    @use "../../sass/_index.scss" as *;
    svg {
        fill: $black;
        &:hover {
            fill: $white;
            circle {
                stroke: $black;
            }
        }
    }
    circle {
        stroke: $grey_1;
    }
</style>
<svg class="logo" width="51" height="51">
    <g>
        <circle cx="25" cy="25" r="25" />
        <g>
            <circle cx="12.5" cy="25" r="12.5" />
            <circle cx="38" cy="25" r="12.5" />
        </g>
        <g>
            <circle cx="6.5" cy="25" r="6.25" />
            <circle cx="19" cy="25" r="6.25" />
            <circle cx="31.5" cy="25" r="6.25" />
            <circle cx="44" cy="25" r="6.25" />
        </g>
    </g>
</svg>