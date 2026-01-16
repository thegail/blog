<script>
    import faviconLight from "$lib/assets/favicon_light.svg";
    import faviconDark from "$lib/assets/favicon_dark.svg";
    import { onMount } from "svelte";

    let isDarkMode = $state(false);
    let favicon = $derived(isDarkMode ? faviconDark : faviconLight);
    let { children } = $props();

    onMount(() => {
        isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
</script>

<svelte:head>
    <title>thegail</title>
    <link rel="apple-touch-icon" href={favicon} />
    <link rel="icon" type="image/png" href={favicon} />
    <link rel="mask-icon" href={favicon} color="#202020" />
    <link rel="shortcut icon" href={favicon} />
    <meta name="theme-color" content={isDarkMode ? "#202020" : "#D0D0D0"} />
</svelte:head>

{@render children()}

<style>
    :global(*) {
        color: var(--secondary);
        font-family: Lato, Helvetica, sans-serif;
    }

    :global(body) {
        background: var(--primary);
        padding-left: 20px;
        padding-right: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: calc(100% - 40px);
        height: 100%;
        margin: 0;
        overflow: hidden;
    }

    :global(html) {
        width: 100%;
        height: 100%;
    }

    @media (prefers-color-scheme: light) {
        :global(:root) {
            --primary: #d0d0d0;
            --secondary: #202020;
        }
    }

    @media (prefers-color-scheme: dark) {
        :global(:root) {
            --primary: #202020;
            --secondary: #d0d0d0;
        }
    }
</style>
