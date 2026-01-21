<script>
    let comment = $state("");
    let commentBox = $state();
    let { article, users, me } = $props();
    let commentLimit = $state(3);
    let imageIndex = $state(0);

    async function postComment() {
        if (comment.length === 0) {
            return;
        }
        if (comment.length > 2000) {
            alert("Comments may not be more than two thousand characters");
            return;
        }
        article.comments.push({ user: me, text: comment });
        await fetch(`/comment/${article._id}`, {
            method: "POST",
            body: comment,
        });
        comment = "";
    }

    function formatDate(timestamp) {
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        let date = new Date(timestamp);
        let day = days[date.getDay()];
        let month = months[date.getMonth()];
        return `${day}, ${month} ${date.getDate()}, ${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
    }
</script>

<article>
    <div class="images">
        <img
            src={article.images[imageIndex].source}
            alt={article.images[imageIndex].alt}
        />
    </div>
    <div>
        <div class="content">
            {@html article.content}
            <p class="timestamp">{formatDate(article.date)}</p>
        </div>
        <h3>Comments</h3>
        {#if article.comments.length > 0}
            <div class="comments">
                {#each article.comments.slice(0, commentLimit) as comment}
                    <p>
                        <strong>{users[comment.user]}</strong>: {comment.text}
                    </p>
                {/each}
                {#if commentLimit < article.comments.length}
                    <button onclick={() => (commentLimit += 5)}>
                        Show more...
                    </button>
                {/if}
            </div>
        {/if}
        <div class="post">
            <textarea
                placeholder="Leave a comment..."
                bind:value={comment}
                bind:this={commentBox}
            ></textarea>
            <button onclick={postComment} disabled={comment.length === 0}>
                Post
            </button>
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
        margin-bottom: 10px;
    }

    :global(article p) {
        margin-top: 0;
        margin-bottom: 10px;
    }

    p.timestamp {
        font-size: 0.8em;
    }

    div.comments {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 10px;
    }

    div.comments p {
        margin: 0;
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
