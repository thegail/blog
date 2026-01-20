<script>
    let comment = $state("");
    let commentBox = $state();
    let { article } = $props();

    async function postComment() {
        article.comments.push({ user: null, text: comment });
        await fetch(`/comment/${article.id}`, {
            method: "POST",
            body: comment,
        });
    }
</script>

<article>
    <img src={article.image} alt={article.alt} />
    <div>
        {@html article.content}
        {#each article.comments as comment}
            <p>{comment.text}</p>
        {/each}
        <textarea
            placeholder="Leave a comment..."
            bind:value={comment}
            bind:this={commentBox}
        ></textarea>
        <button onclick={postComment}>Post</button>
    </div>
</article>

<style>
    article {
        display: flex;
        gap: 20px;
    }

    article img {
        max-width: 50%;
        max-height: 80vh;
        border-radius: 10px;
    }

    article > div {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
    }

    :global(article p) {
        margin: 0;
    }

    textarea {
        background: none;
        border: 2px solid var(--secondary);
        border-radius: 10px;
        align-self: stretch;
        font-size: 0.8em;
        padding: 4px;
        resize: none;
    }
</style>
