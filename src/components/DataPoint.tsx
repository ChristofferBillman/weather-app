interface DataPointProps {
	data: string | number | undefined;
	label?: string
	icon?: string
	color?: string
	onClick?: () => void
}

export default function DataPoint({ data, label, icon, color, onClick }: DataPointProps): JSX.Element {
	return (
		<div className='datapoint-container' onClick={onClick}>
			<div className='row align-center'>
				<h3 style={{ color: color }}>{label}</h3>
				<img src={icon} className='icon-sm' />
			</div>
			<h1 style={{ color: color }}>{data === undefined ? 'N/A' : data}</h1>
		</div>
	)
}