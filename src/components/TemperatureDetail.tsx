import Thermostat from '../icons/thermostat.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import Graph from './Graph'
import { FetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData, {DailyTemp, Info} from '../types/WeatherData'
import Point from '../types/Point'

interface TemperatureDetailProps {
	weatherRequest: FetchRequest<WeatherData>
	transition: Transition
}

export default function TemperatureDetail({ weatherRequest, transition }: TemperatureDetailProps): JSX.Element {
	const {data,error, loading} = weatherRequest
	const weatherData: WeatherData = data as WeatherData

	// Remove all decimals after first one and cast to int.
	const min = Number((((weatherData?.daily[0].temp as DailyTemp).min) as number).toFixed(1))
	const avg = Number((((weatherData?.daily[0].temp as DailyTemp).day) as number).toFixed(1))
	const max = Number((((weatherData?.daily[0].temp as DailyTemp).max) as number).toFixed(1))
	const current = weatherData?.current.temp as number

	const tempData = getTempPerHour(weatherData)
	console.log(tempData)

	if(error) return <p>{error.message}</p>
	
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
				<Graph
					dataPoints={tempData}
					color2={new hsl(tempToHue(max),100,50).toString()}
					color1={new hsl(tempToHue(min),100,50).toString()}
					axisOptions={{boundY: [7,30]}}
				/>
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
		</Detail>
	)
}

function tempToHue(temp: number): number{
	if(temp > 50) return 0
	if(temp < -20) return 238
	return -4*temp - 220
}

function getTempPerHour(weatherData: WeatherData): Point[] {
	return weatherData.hourly.map((hour: Info, index: number) => {
		return new Point(index,hour.temp == undefined ? 0 : hour.temp as number)
	})
}