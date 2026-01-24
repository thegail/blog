<script>
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { goto } from "$app/navigation";

    let name = $state("");
    let email = $state("");

    async function register() {
        if (email.length !== 0 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            alert(
                "Your email address appears to be invalid. Please ensure it's typed correctly.",
            );
            return;
        }
        let response = await fetch("/join", {
            method: "POST",
            body: JSON.stringify({
                name,
                email: email.length === 0 ? null : email,
                code: page.params.code,
            }),
        });
        if (!response.ok) {
            let body = await response.json();
            alert(body.message);
            return;
        }
        let body = await response.json();
        let credential = await navigator.credentials.create({
            publicKey: {
                challenge: Uint8Array.fromHex(body.challenge),
                pubKeyCredParams: [
                    { alg: -7, type: "public-key" },
                    { alg: -8, type: "public-key" },
                    { alg: -257, type: "public-key" },
                ],
                rp: {
                    id: "blog.thegail.co",
                    name: "Teddy's Blog",
                },
                user: {
                    id: new TextEncoder().encode(body.id),
                    name: name,
                    displayName: name,
                },
                attestation: "none",
            },
        });
        await fetch("/join", {
            method: "PUT",
            body: JSON.stringify({
                id: body.id,
                credential: credential,
            }),
        });
        goto("/");
    }
</script>

<main>
    <p>
        Please enter your name below. If you choose to post comments, this is
        the name to which they will be attributed.
    </p>
    <input type="text" placeholder="Your name" bind:value={name} />
    <p>
        If you would like to receive email notifications of new posts, you may
        enter your email address below.
    </p>
    <input
        type="email"
        placeholder="Your email (optional)"
        bind:value={email}
    />
    <button onclick={register}>Next</button>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }

    @media (min-width: 600px) {
        main {
            width: 60%;
        }
    }

    p {
        margin: 0;
    }

    input[type="text"],
    input[type="email"] {
        background: none;
        border: none;
        border-bottom: 2px solid var(--secondary);
        font-size: 0.8em;
    }
</style>
