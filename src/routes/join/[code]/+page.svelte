<script>
    import { onMount } from "svelte";
    import { page } from "$app/state";

    let name = $state("");

    async function register() {
        let response = await (
            await fetch("/join", {
                method: "POST",
                body: JSON.stringify({ name, code: page.params.code }),
            })
        ).json();
        let credential = await navigator.credentials.create({
            publicKey: {
                challenge: Uint8Array.fromHex(response.challenge),
                pubKeyCredParams: [
                    { alg: -7, type: "public-key" },
                    { alg: -8, type: "public-key" },
                    { alg: -257, type: "public-key" },
                ],
                rp: {
                    id: "localhost",
                    name: "Teddy's Photostream",
                },
                user: {
                    id: new TextEncoder().encode(response.id),
                    name: name,
                    displayName: name,
                },
                attestation: "none",
            },
        });
        await fetch("/join", {
            method: "PUT",
            body: JSON.stringify({
                id: response.id,
                credential: credential,
            }),
        });
        window.location = "/";
    }
</script>

<main>
    <p>
        You may enter a name below which will display next to any comments you
        post.
    </p>
    <input type="text" placeholder="Your name" bind:value={name} />
    <button onclick={register}>Next</button>
</main>

<style>
    main {
        width: 60%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }

    p {
        margin: 0;
    }

    input[type="text"] {
        background: none;
        border: none;
        border-bottom: 2px solid var(--secondary);
        font-size: 0.8em;
    }
</style>
