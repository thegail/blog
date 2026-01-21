<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let { data } = $props();

    async function signIn() {
        let challenge = data.challenge;
        if (!challenge) {
            let credential = await navigator.credentials.get({
                mediation: "silent",
                publicKey: {
                    challenge: new Uint8Array(32),
                    rpId: "blog.thegail.co",
                },
            });
            let userId = new TextDecoder().decode(
                credential.response.userHandle,
            );
            let response = await fetch("/signin", {
                method: "POST",
                body: JSON.stringify({ id: userId }),
            });
            if (!response.ok) {
                let body = await response.json();
                alert(body.message);
                return;
            }
            let body = await response.json();
            challenge = body.challenge;
        }
        let credential;
        try {
            credential = await navigator.credentials.get({
                mediation: "silent",
                publicKey: {
                    challenge: Uint8Array.fromHex(challenge),
                    rpId: "blog.thegail.co",
                },
            });
        } catch (error) {
            alert("Failed to sign in");
        }
        let response = await fetch("/signin", {
            method: "PUT",
            body: JSON.stringify({ credential }),
        });
        if (!response.ok) {
            let body = await response.json();
            alert(body.message);
            return;
        }
        goto("/");
    }
</script>

<button class="invisible" onclick={signIn}>
    <main>
        <div class="button">Click to sign in</div>
    </main>
</button>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
        width: 100%;
        align-items: center;
    }

    button.invisible {
        display: contents;
        cursor: auto;
    }

    .button {
        background: var(--secondary);
        color: var(--primary);
        font-size: 1.2rem;
        border: none;
        border-radius: 10px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 5px;
        padding-bottom: 5px;
        cursor: pointer;
    }
</style>
