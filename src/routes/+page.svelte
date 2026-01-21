<script>
    import photo1 from "$lib/assets/photo1.jpeg";
    import photo2 from "$lib/assets/photo2.jpeg";
    import Article from "./Article.svelte";

    let { data } = $props();
    let articles = $state(data.articles);
</script>

<main>
    {#each articles as article, index}
        <Article
            bind:article={articles[index]}
            users={data.users}
            me={data.me}
        />
        {#if index < articles.length - 1}
            <hr />
        {/if}
    {/each}
</main>

<style>
    main {
        padding-bottom: 20px;
    }

    :global(body) {
        overflow-y: scroll;
    }

    hr {
        margin-top: 20px;
        margin-bottom: 20px;
    }

    @media (max-width: 600px) {
        main {
            width: calc(100% - 10px);
        }
    }

    @media (min-width: 600px) {
        main {
            width: 60%;
        }
    }
</style>
