<script lang="ts">
	import { PUBLIC_GOOGLE_MAP_API_KEY } from '$env/static/public'
	import { onMount } from 'svelte'
	import Input from './ui/input/input.svelte'
	import LocationMarkerIcon from 'virtual:icons/fa6-solid/location-dot'

	export let placeholder: string | undefined = undefined

	let inputElement: HTMLInputElement
	let mapElement: HTMLDivElement
	export let latitude: number = 3.1319
	export let longitude: number = 101.6841

	onMount(async () => {
		console.log('loading')
		const { Loader } = await import('@googlemaps/js-api-loader')
		const loader = new Loader({
			apiKey: PUBLIC_GOOGLE_MAP_API_KEY,
			version: 'weekly',
		})

		const [Places, Map, GeoCoder] = await Promise.all([
			loader.importLibrary('places'),
			loader.importLibrary('maps'),
			loader.importLibrary('geocoding'),
		])

		const autocomplete = new Places.Autocomplete(inputElement)

		const map = new Map.Map(mapElement, {
			zoom: 8,
			center: { lat: latitude, lng: longitude },
			rotateControl: false,
			streetViewControl: false,
			fullscreenControl: false,
			mapTypeControl: false,
		})

		const geocoder = new GeoCoder.Geocoder()

		autocomplete.addListener('place_changed', async () => {
			const place = autocomplete.getPlace()
			const result = await geocoder.geocode({
				placeId: place.place_id,
			})
			latitude = result.results[0].geometry.location.lat()
			longitude = result.results[0].geometry.location.lng()

			map.moveCamera({
				center: { lat: latitude, lng: longitude },
				zoom: 15,
			})
		})

		map.addListener('drag', async () => {
			const center = map.getCenter()
			if (center == null) {
				return
			}

			const { lat, lng } = center
			latitude = lat()
			longitude = lng()
		})
	})
</script>

<div class="flex flex-col gap-2">
	<Input bind:inputEl={inputElement} {placeholder} />
	<div class="relative">
		<div bind:this={mapElement} class="h-96 w-full"></div>
		<LocationMarkerIcon class="absolute left-1/2 top-1/2 text-3xl text-red-500 opacity-85" />
	</div>
</div>
