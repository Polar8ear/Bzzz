<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Input } from '$lib/components/ui/input'
	import { Label } from '$lib/components/ui/label'
	import { superForm } from 'sveltekit-superforms'

	export let data

	const { form, enhance, errors, constraints, message } = superForm(data.form)

	let isShowPassword = false
</script>

<div
	class="container relative flex h-[800px] min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
		<div
			class="absolute inset-0 bg-cover"
			style="
				background-image:
					url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80);"
		/>
		<div class="relative z-20 flex items-center text-lg font-medium">Bzzz</div>
		<div class="relative z-20 mt-auto">
			<blockquote class="space-y-2">
				<p class="text-lg">
					&ldquo;This system has saved me from a sudden plumbing issue. Highly Recommended&rdquo;
				</p>
				<footer class="text-sm">Alia</footer>
			</blockquote>
		</div>
	</div>
	<div class="lg: lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Create an account</h1>
				<p class="text-sm text-muted-foreground">
					Enter your email and password below to create your account
				</p>
			</div>
			<div class="grid gap-6">
				{#if $message != null}
					<div>
						{$message}
					</div>
				{/if}
				<form action="?/email" method="POST" use:enhance>
					<div class="grid gap-2">
						<div class="grid gap-1">
							<Label class="sr-only" for="email">Email</Label>
							<Input
								id="email"
								placeholder="name@example.com"
								name="email"
								type="email"
								autocapitalize="none"
								autocomplete="email"
								autocorrect="off"
								bind:value={$form.email}
								aria-invalid={$errors.email ? 'true' : undefined}
								{...$constraints.email}
							/>
							{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
						</div>
						<div class="grid gap-1">
							<Label class="sr-only" for="password">Password</Label>
							<div class="relative">
								<Input
									id="password"
									placeholder="********"
									type={isShowPassword ? 'text' : 'password'}
									name="password"
									autocomplete="password"
									autocorrect="off"
									bind:value={$form.password}
									aria-invalid={$errors.password ? 'true' : undefined}
									{...$constraints.password}
								/>
								<div class="absolute bottom-0 right-4 top-0 h-full content-center">
									<button
										on:click={() => (isShowPassword = !isShowPassword)}
										class="cursor-pointer"
										type="button"
									>
										{#if isShowPassword}
											I
										{:else}
											O
										{/if}
									</button>
								</div>
							</div>
							{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
						</div>
						<Button type="submit">Sign Up with Email</Button>
						<a href="/sign-in" class="text-center text-xs opacity-80">Sign in instead</a>
					</div>
				</form>
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<span class="w-full border-t" />
					</div>
					<div class="relative flex justify-center text-xs uppercase">
						<span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
					</div>
				</div>
				<form action="?/github" method="POST">
					<Button variant="outline" type="submit" class="w-full">GitHub</Button>
				</form>
				<form action="?/google" method="POST">
					<Button variant="outline" type="submit" class="w-full">Google</Button>
				</form>
				<form action="?/email" method="POST"></form>
			</div>

			<p class="px-8 text-center text-sm text-muted-foreground">
				By clicking continue, you agree to our
				<a href="/terms" class="underline underline-offset-4 hover:text-primary">
					Terms of Service
				</a>
				and
				<a href="/privacy" class="underline underline-offset-4 hover:text-primary">
					Privacy Policy
				</a>
				.
			</p>
		</div>
	</div>
</div>
