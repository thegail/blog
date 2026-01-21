<script>
    let comment = $state("");
    let commentBox = $state();
    let { article, users } = $props();

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
            <p><strong>{users[comment.user]}</strong>: {comment.text}</p>
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
        flex-wrap: wrap;
    }

    article img {
        max-width: min(400px, 100%);
        border-radius: 10px;
    }

    article > div {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: flex-start;
    }

    @media (min-width: 600px) {
        article > div {
            width: 30%;
            flex-grow: 1;
        }
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
