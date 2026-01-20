<script>
    import { onMount } from "svelte";

    let { data } = $props();

    async function signIn() {
        let challenge = data.challenge;
        let credential = await navigator.credentials.get({
            mediation: "silent",
            publicKey: {
                challenge: Uint8Array.fromHex(challenge),
                rpId: "localhost",
            },
        });
        await fetch("/signin", {
            method: "POST",
            body: JSON.stringify({ credential }),
        });
        window.location = "/";
    }
</script>

<main>
    <button onclick={signIn}>Sign in</button>
</main>
