<script lang="ts">
	import { PUBLIC_GOOGLE_MAP_API_KEY } from '$env/static/public'
	import { onMount } from 'svelte'
	import Input from './ui/input/input.svelte'
	import LocationMarkerIcon from 'virtual:icons/fa6-solid/location-dot'
	import CurrentLocationIcon from 'virtual:icons/fa6-solid/location-crosshairs'

	export let placeholder: string | undefined = undefined

	let inputElement: HTMLInputElement
	let mapElement: HTMLDivElement
	export let latitude: number = 3.1319
	export let longitude: number = 101.6841

	let map: google.maps.Map

	export const changeCoordinates = (newLatitude: number, newLongitude: number) => {
		latitude = newLatitude
		longitude = newLongitude

		map.moveCamera({
			center: { lat: latitude, lng: longitude },
			zoom: 15,
		})
	}

	const getCurrentLocation = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			latitude = position.coords.latitude
			longitude = position.coords.longitude

			changeCoordinates(latitude, longitude)
		})
	}

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

		map = new Map.Map(mapElement, {
			zoom: 12,
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

			changeCoordinates(latitude, longitude)
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
		<button
			type="button"
			on:click={getCurrentLocation}
			class="absolute bottom-2 left-2 rounded-full bg-blue-900 p-2 text-2xl text-white"
		>
			<CurrentLocationIcon />
		</button>
	</div>
</div>
