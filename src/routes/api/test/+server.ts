import { db } from '$lib/server/db'
import { services } from '$lib/server/db/schema'

export const GET = async () => {
	const handymanServices = [
		{
			name: 'Furniture Assembly',
			price: 2000,
			details:
				'<p>No more frustration with flat-pack furniture. Our <strong>Furniture Assembly</strong> service makes it easy and hassle-free.</p>',
		},
		{
			name: 'Door and Window Repair',
			price: 2000,
			details:
				'<p>Secure and beautify your home with our expert <strong>Door and Window Repair</strong> services.</p>',
		},
		{
			name: 'Appliance Repair',
			price: 2000,
			details:
				'<p>Get your appliances back in top shape with our reliable <strong>Appliance Repair</strong> service. Efficiency guaranteed.</p>',
		},
		{
			name: 'Gutter Cleaning',
			price: 2000,
			details:
				'<p>Protect your home from water damage with our thorough <strong>Gutter Cleaning</strong> service. Let us do the dirty work.</p>',
		},
		{
			name: 'Roofing Repair',
			price: 2000,
			details:
				"<p>Keep your roof in peak condition with our comprehensive <strong>Roofing Repair</strong> services. We've got you covered.</p>",
		},
		{
			name: 'Tile Installation',
			price: 2000,
			details:
				'<p>Upgrade your home with our precise and stylish <strong>Tile Installation</strong> services. Perfect finishes every time.</p>',
		},
		{
			name: 'Grout Cleaning',
			price: 2000,
			details:
				'<p>Revitalize your tiles with our professional <strong>Grout Cleaning</strong> service. Say goodbye to grime.</p>',
		},
		{
			name: 'Fence Repair',
			price: 2000,
			details:
				"<p>Restore your property's security and appeal with our reliable <strong>Fence Repair</strong> services.</p>",
		},
		{
			name: 'Lawn Mowing',
			price: 2000,
			details:
				'<p>Keep your lawn looking pristine with our efficient <strong>Lawn Mowing</strong> service. Your yard, our care.</p>',
		},
		{
			name: 'Garden Landscaping',
			price: 15000,
			details:
				'<p>Transform your outdoor space with our creative <strong>Garden Landscaping</strong> services. Beauty in every corner.</p>',
		},
		{
			name: 'Pressure Washing',
			price: 8000,
			details:
				'<p>Remove stubborn dirt and grime with our powerful <strong>Pressure Washing</strong> service. Clean surfaces guaranteed.</p>',
		},
		{
			name: 'Home Cleaning',
			price: 5000,
			details:
				'<p>Experience a spotless home with our meticulous <strong>Home Cleaning</strong> service. Relax while we do the work.</p>',
		},
		{
			name: 'Pest Control',
			price: 10000,
			details:
				'<p>Protect your home from unwanted guests with our effective <strong>Pest Control</strong> solutions. Peace of mind guaranteed.</p>',
		},
		{
			name: 'Security System Installation',
			price: 2000,
			details:
				'<p>Secure your property with our advanced <strong>Security System Installation</strong> services. Safety first.</p>',
		},
	]

	await db.insert(services).values(handymanServices)

	return new Response()
}
