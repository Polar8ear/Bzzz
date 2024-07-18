import { serviceService } from '$lib/server/services/services'
export const load = async () => {
	return {
		services: await serviceService.recommendServices(3),
	}
}
