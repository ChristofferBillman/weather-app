export interface DataPointProps {
	data: string | number | undefined;
	label?: string
	icon?: string
	hasSection?: DetailSections
	dataColor?: string
	labelColor?: string
	size?: 'sm' | 'lg' | undefined
	onClick?: () => void
}
export enum DetailSections {
	TEMP,
	RAIN,
	DEBUG,
	HUMIDITY
}

export default function DataPoint({ data, label, icon, dataColor, labelColor, size, onClick }: DataPointProps): JSX.Element {
	return (
		<div
			className={getContainerClass(size)}
			style={onClick == undefined ? {cursor: 'auto'} : {cursor: 'pointer'}}
			onClick={onClick}
		>
			<div className='row align-center'>
				<h3 style={{ color: labelColor }}>{label}</h3>
				<img src={icon} className='icon-sm' />
			</div>
			<h1 style={{ color: dataColor }}>{data === undefined ? 'N/A' : data}</h1>
		</div>
	)
}

function getContainerClass(size: string | undefined) {
	switch(size){
	case 'lg':
		return 'datapoint-container'
	case 'sm':
		return 'datapoint-container datapoint-sm'
	default:
		return 'datapoint-container'
	}
}