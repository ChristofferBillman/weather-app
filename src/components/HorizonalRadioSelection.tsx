import { hsl } from './Detail'

interface Props {
	items: string[]
	selection: string
	setSelection: (selected: string) => void
	hue: number
}

export default function HorizonalRadioSelection({items, selection, setSelection, hue}: Props): JSX.Element {

	return (
		<div
			className='horizontal-radio-selection-container'
		>
			{items.map(item => (
				<RadioSelectionItem
					key={item}
					text={item}
					hue={hue}
					setSelected={setSelection}
					selected={selection == item}
				/>
			))}
		</div>
	)
}

interface RadioSelectionItemProps {
	text: string
	hue: number
	selected: boolean
	setSelected: (selected: string) => void
}
function RadioSelectionItem({text, hue, setSelected, selected}: RadioSelectionItemProps): JSX.Element {

	const color = new hsl(hue,100,30).toString()

	return  (
		<div
			className={selected ?
				'horizontal-radio-selection-item selected' :
				'horizontal-radio-selection-item'}
			onClick={() => setSelected(text)}
		>
			<p style={{color: color, fontWeight: 700}}>{text}</p>
		</div>
	)
}