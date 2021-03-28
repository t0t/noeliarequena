<script>

</script>

<style lang="scss">
    @use "../../sass/_index.scss" as *;
    body {
        position: relative;
    }
    .Loading {
        display: grid;
        place-content: center;
        width: 100vw;
        height: 100vh;
        margin-bottom: auto;
        margin-top: auto;

        svg {
            width: 300px;
            height: 300px;
            stroke-width: 1px;
        }

        circle {
            stroke: $grey_0;
            fill: none;
            animation-duration: .5s;
            animation-iteration-count: infinite;
            transform: translate(50px,50px);
            transform-origin: -150px -150px;
            &:nth-child(1) {
                animation-name: loading;
            }
            &:nth-child(6) {
                animation-name: loading;
            }
            &:nth-child(7) {
                animation-name: loading;
            }
        }

        text {
            fill: $grey_2;
        }
    }
</style>

<div class="Loading">
    <svg viewBox="0 0 300 300">
        <circle cx="100" cy="100" r="50" />

        <circle cx="62.5" cy="100" r="12.5" />
        <circle cx="88" cy="100" r="12.5" />
        <circle cx="112.5" cy="100" r="12.5" />
        <circle cx="138" cy="100" r="12.5" />
        
        <circle cx="75" cy="100" r="25" />
        <circle cx="125" cy="100" r="25" />

        <text x="85" y="230">receiving data...</text>
    </svg>
</div>

<slot></slot>