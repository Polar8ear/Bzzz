type ServiceRequest = {
	completedAt: Date | null
	paidAt: Date | null
	deletedAt: Date | null
	startedAt: Date
	endedAt: Date
}

export const getStatusFromRequest = (request: ServiceRequest) => {
	const now = new Date()

	if (request.deletedAt != null) {
		return 'Deleted'
	}

	if (request.completedAt != null) {
		return 'Completed'
	}

	if (request.paidAt == null) {
		return 'Pending Payment'
	}

	if (now >= request.startedAt && now < request.endedAt) {
		return 'In Progress'
	}

	if (now < request.startedAt) {
		return 'Upcoming'
	}

	if (now >= request.endedAt) {
		return 'Expired'
	}

	return 'Unknown'
}
