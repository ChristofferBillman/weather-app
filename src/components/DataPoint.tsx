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
	WIND,
	DEBUG,
}

export default function DataPoint({ data, label, icon, dataColor, labelColor, size, onClick }: DataPointProps): JSX.Element {

	if(size === undefined) size = 'lg'
	
	return (
		<div className='datapoint-container' onClick={onClick}>
			<div className='row align-center'>
				<h3
					style={{
						color: labelColor,
						fontSize: size === 'lg' ? '1.5rem' : '1rem'
					}}
				>
					{label}
				</h3>
				<img src={icon} className='icon-sm' />
			</div>
			<h1
				style={{
					color: dataColor,
					fontSize: size === 'lg' ? '4rem' : '3rem'
				}}
			>
				{data === undefined ? 'N/A' : data}
			</h1>
		</div>
	)
}