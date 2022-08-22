import TransitionLifecycle, { Transition } from './TransitionLifecycle'
import WeatherData from '../types/WeatherData'

import Thermostat from '../icons/thermostat.svg'
import DataPoint from './DataPoint'

interface DetailProps {
	data: WeatherData | undefined
	loading: boolean
	error: Error | undefined
	transition: Transition
}

const HUE = 47

class hsl {
	h: number
	s: number
	l: number

	constructor(h: number, s: number, l: number) {
		this.h = h
		this.s = s
		this.l = l
	}
	public toString(): string {
		return `hsl(${this.h}, ${this.s}%, ${this.l}%)`
	}
}

export default function TemperatureDetail({ data, loading, error, transition }: DetailProps): JSX.Element {
	return (
		<div className='detail-container' style={{ backgroundColor: new hsl(HUE, 100, 96).toString() }}>
			<div className='row align-center'>
				<h1>Temperature</h1>
				<img src={Thermostat} className='icon-sm' />
			</div>
			{loading && ('Loading...')}

			<TransitionLifecycle
				willRender={!loading}
				transition={transition}
				verbose={true}
			>
				{error ?
					error.message
					:
					<DataPoint
						data={data?.current.temp as number + '°C'}
						label='Now'
					/>
				}
			</TransitionLifecycle>
		</div>
	)
}