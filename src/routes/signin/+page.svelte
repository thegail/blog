<script>
    import { onMount } from "svelte";

    let { data } = $props();

    async function signIn() {
        let challenge = data.challenge;
        if (!challenge) {
            let credential = await navigator.credentials.get({
                mediation: "silent",
                publicKey: {
                    challenge: new Uint8Array(32),
                    rpId: "localhost",
                },
            });
            let userId = new TextDecoder().decode(
                credential.response.userHandle,
            );
            let response = await (
                await fetch("/signin", {
                    method: "POST",
                    body: JSON.stringify({ id: userId }),
                })
            ).json();
            console.log(response);
            challenge = response.challenge;
        }
        console.log(challenge);
        let credential = await navigator.credentials.get({
            mediation: "silent",
            publicKey: {
                challenge: Uint8Array.fromHex(challenge),
                rpId: "localhost",
            },
        });
        await fetch("/signin", {
            method: "PUT",
            body: JSON.stringify({ credential }),
        });
        window.location = "/";
    }
</script>

<main>
    <button onclick={signIn}>Click to sign in</button>
</main>
