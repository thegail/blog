<script>
    import { fly } from "svelte/transition";

    let comment = $state("");
    let commentBox = $state();
    let { article, users, me, images } = $props();
    let commentLimit = $state(3);
    let imageIndex = $state(0);
    let flyDirection = $state(1);
    let maxAspect = $derived(
        Math.min(...article.images.map((i) => i.width / i.height)),
    );

    function imageForward() {
        flyDirection = 1;
        imageIndex += 1;
    }

    function imageBack() {
        flyDirection = -1;
        imageIndex -= 1;
    }

    async function postComment() {
        if (comment.length === 0) {
            return;
        }
        if (comment.length > 2000) {
            alert("Comments may not be more than two thousand characters");
            return;
        }
        article.comments.push({ user: me, text: comment });
        let response = await fetch(`/comment/${article._id}`, {
            method: "POST",
            body: comment,
        });
        if (!response.ok) {
            let body = await response.json();
            alert(body.message);
            return;
        }
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
    <div class="images" style="aspect-ratio: {maxAspect}">
        {#key imageIndex}
            <img
                src={images[article.images[imageIndex].key]}
                alt={article.images[imageIndex].alt}
                width={article.images[imageIndex].width}
                height={article.images[imageIndex].height}
                in:fly={{ x: flyDirection * 400 }}
                out:fly={{ x: flyDirection * -400 }}
            />
        {/key}
        {#if article.images.length > 1}
            <button
                class="back"
                onclick={imageBack}
                disabled={imageIndex === 0}
            >
                <span>&lsaquo;</span>
            </button>
            <button
                class="forward"
                onclick={imageForward}
                disabled={imageIndex === article.images.length - 1}
            >
                <span>&rsaquo;</span>
            </button>
        {/if}
        <div class="indicator">{imageIndex + 1} of {article.images.length}</div>
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

    .images {
        max-width: min(400px, 100%);
        border-radius: 10px;
        display: grid;
        grid-template: 1fr 30px 1fr 21px / 36px 1fr 15px 36px;
        overflow: hidden;
    }

    .images img {
        grid-area: 1 / 1 / 5 / 5;
        max-width: 100%;
        object-fit: cover;
        align-self: center;
        z-index: -1;
    }

    button.back {
        width: 30px;
        height: 30px;
        padding: 0;
        border-radius: 15px;
        margin-left: 6px;
        grid-area: 2 / 1 / 3 / 2;
        font-size: 1.3em;
        line-height: 30px;
    }

    button.forward {
        width: 30px;
        height: 30px;
        padding: 0;
        border-radius: 15px;
        margin-right: 6px;
        grid-area: 2 / 4 / 3 / 4;
        font-size: 1.3em;
        line-height: 30px;
    }

    button.back span,
    button.forward span {
        color: var(--primary);
        position: relative;
        top: -2px;
    }

    .indicator {
        background: var(--secondary);
        color: var(--primary);
        font-size: 0.7em;
        margin-right: 6px;
        margin-bottom: 6px;
        grid-area: 4 / 3 / 5 / 5;
        border-radius: 4px;
        justify-self: end;
        padding: 2px;
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
