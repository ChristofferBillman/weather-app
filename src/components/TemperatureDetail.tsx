import Thermostat from '../icons/thermostat.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import { fetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData, {DailyTemp} from '../types/WeatherData'

interface TemperatureDetailProps {
	weatherRequest: fetchRequest
	transition: Transition
}

export default function TemperatureDetail({ weatherRequest, transition }: TemperatureDetailProps): JSX.Element {
	const {data,error, loading} = weatherRequest
	const typedData: WeatherData = data as WeatherData

	// Remove all decimals after first one and cast to int.
	const min = Number((((typedData?.daily[0].temp as DailyTemp).min) as number).toFixed(1))
	const avg = Number((((typedData?.daily[0].temp as DailyTemp).day) as number).toFixed(1))
	const max = Number((((typedData?.daily[0].temp as DailyTemp).max) as number).toFixed(1))
	const current = typedData?.current.temp as number
	
	return (
		<Detail
			loading={loading}
			transition={transition}
			hue={tempToHue(current)}
		>
			<>
				<div className='row align-center'>
					<h1>Temperature</h1>
					<img src={Thermostat} className='icon-lg' />
				</div>
				{error ?
					error.message
					:
					<>
						<DataPoint
							data={current + '°C'}
							dataColor={new hsl(tempToHue(current), 100, 40).toString()}
							label='Now'
						/>
						<div className='row'>
							<DataPoint
								data={max + '°C'}
								label='Max'
								size='sm'
								dataColor={new hsl(tempToHue(max), 100,40).toString()}
							/>
							<DataPoint
								data={min + '°C'}
								label='Min'
								size='sm'
								dataColor={new hsl(tempToHue(min), 100,40).toString()}
							/>
							<DataPoint
								data={avg + '°C'}
								label='Avg'
								size='sm'
								dataColor={new hsl(tempToHue(avg), 100,40).toString()}
							/>
						</div>
					</>
				}
			</>
		</Detail>
	)
}

function tempToHue(temp: number): number{
	if(temp > 50) return 0
	if(temp < -20) return 238
	return -4*temp - 220
}