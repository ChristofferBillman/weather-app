export interface DataPointProps {
	data: string | number | undefined;
	label?: string
	icon?: string
	hasSection?: DetailSections
	dataColor?: string
	labelColor?: string
	onClick?: () => void
}
export enum DetailSections {
	TEMP,
	RAIN,
	DEBUG,
}

export default function DataPoint({ data, label, icon, dataColor, labelColor, onClick }: DataPointProps): JSX.Element {
	return (
		<div className='datapoint-container' onClick={onClick}>
			<div className='row align-center'>
				<h3 style={{ color: labelColor }}>{label}</h3>
				<img src={icon} className='icon-sm' />
			</div>
			<h1 style={{ color: dataColor }}>{data === undefined ? 'N/A' : data}</h1>
		</div>
	)
}