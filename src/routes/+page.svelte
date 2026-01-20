<script>
    import photo1 from "$lib/assets/photo1.jpeg";
    import photo2 from "$lib/assets/photo2.jpeg";
    import Article from "./Article.svelte";

    let { data } = $props();
    let articles = $state([
        {
            id: "0",
            image: photo1,
            content:
                "<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate nemo doloremque quasi esse fugiat necessitatibus illum optio dignissimos officiis ex, nulla quis cupiditate! Ipsum amet officia voluptas minima exercitationem reprehenderit.</p>",
            comments: [],
        },
        {
            id: "1",
            image: photo2,
            content:
                "<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate nemo doloremque quasi esse fugiat necessitatibus illum optio dignissimos officiis ex, nulla quis cupiditate! Ipsum amet officia voluptas minima exercitationem reprehenderit.</p>",
            comments: [],
        },
    ]);
</script>

<main>
    {#each articles as article, index}
        <Article bind:article={articles[index]} />
        {#if index < articles.length - 1}
            <hr />
        {/if}
    {/each}
</main>

<style>
    main {
        width: 60%;
        overflow-y: scroll;
    }

    hr {
        margin-top: 20px;
        margin-bottom: 20px;
    }
</style>
