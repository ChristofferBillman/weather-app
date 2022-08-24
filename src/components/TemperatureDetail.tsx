import Thermostat from '../icons/thermostat.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import { fetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData from '../types/WeatherData'

interface TemperatureDetailProps {
	weatherRequest: fetchRequest
	transition: Transition
}

const HUE = 47

export default function TemperatureDetail({ weatherRequest, transition }: TemperatureDetailProps): JSX.Element {
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
					<h1>Temperature</h1>
					<img src={Thermostat} className='icon-lg' />
				</div>
				{error ?
					error.message
					:
					<DataPoint
						data={typedData?.current.temp as number + '°C'}
						dataColor={new hsl(HUE, 100, 40).toString()}
						label='Now'
					/>
				}
			</>
		</Detail>
	)
}