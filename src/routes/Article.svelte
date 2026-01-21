<script>
    let comment = $state("");
    let commentBox = $state();
    let { article, users, me } = $props();

    async function postComment() {
        if (comment.length === 0) {
            return;
        }
        article.comments.push({ user: me, text: comment });
        await fetch(`/comment/${article.id}`, {
            method: "POST",
            body: comment,
        });
        comment = "";
    }
</script>

<article>
    <img src={article.image} alt={article.alt} />
    <div>
        <div class="content">
            {@html article.content}
        </div>
        <h3>Comments</h3>
        {#if article.comments.length > 0}
            <div class="comments">
                {#each article.comments as comment}
                    <p>
                        <strong>{users[comment.user]}</strong>: {comment.text}
                    </p>
                {/each}
            </div>
        {/if}
        <div class="post">
            <textarea
                placeholder="Leave a comment..."
                bind:value={comment}
                bind:this={commentBox}
            ></textarea>
            <button onclick={postComment}>Post</button>
        </div>
    </div>
</article>

<style>
    article {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        justify-content: center;
    }

    article img {
        max-width: min(400px, 100%);
        border-radius: 10px;
    }

    article > div {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    @media (min-width: 600px) {
        article > div {
            width: 30%;
            flex-grow: 1;
        }
    }

    div.content {
        margin-bottom: 20px;
    }

    :global(article p) {
        margin: 0;
    }

    div.comments {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 10px;
    }

    h3 {
        margin-top: 0;
        margin-bottom: 10px;
    }

    div.post {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-self: stretch;
        align-items: flex-start;
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
