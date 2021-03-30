<style lang="scss">
  @use "../../sass/_index.scss" as *;

  .Links {
    padding-top: 0;
    padding-bottom: $h3;
    background-color: $grey_5;
    display: grid;
    justify-items: center;
    align-content:center;
    @include media(s2) {
      padding-top: $h5;
      padding-bottom: $h5;
    }

    ul {
      width: 100%;
      text-align: center;
    }

    a[target="_blank"]:after {
      content: "";
    }

    svg {
      max-width: $h2;
      padding-top: $h1;
      margin-left: $h-1;
      margin-right: $h-1;
      fill: $grey_1;
      &:hover {
        fill: $highlight;
      }
      @include media(s2) {
        margin-left: $h1;
        margin-right: $h1;
      }
    }
    small {
      color: $grey_1;
    }
  }
</style>

<aside class="Links">
    <small>Follow me at Instagram</small>
    <ul>
      <li>
        <a href="https://www.instagram.com/noelia__requena/" target="_blank" rel="noopener">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <title>Instagram</title>
            <circle cx="12.145" cy="3.892" r="0.96" />
            <path d="M8,12c-2.206,0-4-1.794-4-4s1.794-4,4-4s4,1.794,4,4S10.206,12,8,12zM8,6C6.897,6,6,6.897,6,8s0.897,2,2,2s2-0.897,2-2S9.103,6,8,6z" />
            <path d="M12,16H4c-2.056,0-4-1.944-4-4V4c0-2.056,1.944-4,4-4h8c2.056,0,4,1.944,4,4v8C16,14.056,14.056,16,12,16zM4,2C3.065,2,2,3.065,2,4v8c0,0.953,1.047,2,2,2h8c0.935,0,2-1.065,2-2V4c0-0.935-1.065-2-2-2H4z" />
          </svg>
        </a>
      </li>
    </ul>
</aside>