import Waterdrop from '../icons/waterdrop.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import { fetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData from '../types/WeatherData'

interface RainDetailProps {
	weatherRequest: fetchRequest
	transition: Transition
}

const HUE = 223

export default function TemperatureDetail({ weatherRequest, transition }: RainDetailProps): JSX.Element {
	const {data,error} = weatherRequest
	const typedData: WeatherData = data as WeatherData
	return (
		<Detail
			weatherRequest={weatherRequest}
			transition={transition}
			hue={HUE}
		>
			<>
				<div className='row align-center'>
					<h1>Percipication</h1>
					<img src={Waterdrop} className='icon-lg' />
				</div>
				{error ?
					error.message
					:
					<DataPoint
						data={typedData?.current.temp + '°C'}
						dataColor={new hsl(HUE, 100, 40).toString()}
						label='Now'
					/>
				}
			</>
		</Detail>
	)
}