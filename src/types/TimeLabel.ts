export default class TimeLabels {
	private timeLabels: [number,string][] = [
		[0 , '00'],
		[3 , '03'],
		[6 , '06'],
		[9 , '09'],
		[12, '12'],
		[15, '15'],
		[18, '18'],
		[21, '21'],
		[24, '24']
	]
	static getLabels(spacing: number, startHour: number, endHour: number) {
		const labels: [number, string][] = []
		for(let i = startHour; i <= endHour; i += spacing){
			const currentHour = i % 24
			let label

			if(currentHour < 10) label = '0' + String(currentHour)
			else label = String(currentHour)

			// minus startHour to ensure correct placement in graph.
			labels.push([i - startHour, label])
		}
		return labels
	}
}