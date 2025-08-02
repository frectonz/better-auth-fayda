<script lang="ts">
	import { authClient } from '$lib/auth-client';

	const currentSession = authClient.useSession();

	function signIn() {
		authClient.signIn.oauth2({
			providerId: 'fayda',
			scopes: ['openid', 'profile', 'email']
		});
	}
</script>

<h1>Sign In With Fayda</h1>

<button onclick={signIn}>Sign In With Fayda</button>

<h1>Current Session</h1>

<div>
	{#if $currentSession.data}
		<div class="session-container">
			<div class="session-flex">
				<div class="session-column">
					<h3>Session</h3>
					<pre class="json-block">{JSON.stringify($currentSession.data.session, null, 2)}</pre>
				</div>
				<div class="session-column">
					<h3>User</h3>
					<pre class="json-block">{JSON.stringify($currentSession.data.user, null, 2)}</pre>
				</div>
			</div>
		</div>
	{:else}
		<p>No current session</p>
	{/if}
</div>
