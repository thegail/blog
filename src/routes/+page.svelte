<script>
    import photo1 from "$lib/assets/photo1.jpeg";
    import photo2 from "$lib/assets/photo2.jpeg";
</script>

<header>
    <h1>Teddy's photostream</h1>
</header>
<main>
    <article>
        <img src={photo1} alt="Item 1" />
        <div>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sunt
                at eligendi doloremque! Cum porro, explicabo fugit odit,
                repudiandae perspiciatis est sunt veniam pariatur cumque
                corporis unde maxime architecto nobis optio.
            </p>
        </div>
    </article>
    <hr />
    <article>
        <img src={photo2} alt="Item 2" />
        <div>
            <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni
                molestias nesciunt reiciendis quia, unde ullam obcaecati odio,
                voluptatem excepturi tenetur impedit illum nemo totam aperiam
                deserunt laborum recusandae esse fugit.
            </p>
        </div>
    </article>
</main>

<style>
    header {
        width: 60%;
    }

    h1 {
        font-family: "DM Serif Display", serif;
    }

    main {
        width: 60%;
        overflow-y: scroll;
    }

    article {
        display: flex;
        gap: 20px;
    }

    article img {
        max-width: 50%;
        max-height: 80vh;
        border-radius: 10px;
    }

    hr {
        margin-top: 20px;
        margin-bottom: 20px;
    }
</style>
