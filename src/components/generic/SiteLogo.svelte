<script>

</script>
<style lang="scss">
    @use "../../sass/_index.scss" as *;
    svg {
        mix-blend-mode: multiply;
        fill: none;
        &:hover {
            fill: $white;
            circle {
                stroke: $black;
            }
        }
    }
    circle {
        stroke: $grey_2;
        &:nth-child(3) {
            fill: none;
        }
    }
</style>
<svg class="logo" width="53" height="53" viewBox="0 0 53 53">
    >
    <g>
        <circle cx="26.5" cy="26.5" r="25.5"/>
        <circle cx="26.83" cy="17.83" r="16.83"/>
        <circle cx="26.83" cy="35.17" r="16.83"/>
        <circle cx="27.25" cy="26.25" r="8.25"/>
    </g>
</svg>