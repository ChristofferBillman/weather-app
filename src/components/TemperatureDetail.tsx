import Thermostat from '../icons/thermostat.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import Graph from './Graph'
import { FetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData, {Info} from '../types/WeatherData'
import Point from '../types/Point'
import TimeLabel from '../types/TimeLabel'

interface TemperatureDetailProps {
	weatherRequest: FetchRequest<WeatherData>
	transition: Transition
}

export default function TemperatureDetail({ weatherRequest, transition }: TemperatureDetailProps): JSX.Element {
	const {data,error, loading} = weatherRequest
	const weatherData: WeatherData = data as WeatherData

	const tempData = getTempPerHour(weatherData)

	const min = getMinTemp(tempData)
	const avg = getAvgTemp(tempData)
	const max = getMaxTemp(tempData)
	const current = weatherData?.current.temp as number

	const yLabels: [number,string][] = [
		[min-5, String(min-5)],
		[min, String(min)],
		[max, String(max)],
		[max + 5, String(max+5)]
	]

	const date = new Date((weatherData.hourly[0].dt + weatherData.timezone_offset) * 1000)
	const startHour = date.getHours()

	const xLabels = TimeLabel.getLabels(3,startHour, startHour + 24)

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
					axisOptions={{xLabels, yLabels, boundX: [0,24], boundY: [min-5, max+5]}}
				/>
				<div className='row'>
					<DataPoint
						data={current + '°C'}
						dataColor={new hsl(tempToHue(current), 100, 40).toString()}
						label='Now'
					/>
					<DataPoint
						data={max.toFixed(1) + '°C'}
						label='Max'
						size='sm'
						dataColor={new hsl(tempToHue(max), 100,40).toString()}
					/>
					<DataPoint
						data={min.toFixed(1) + '°C'}
						label='Min'
						size='sm'
						dataColor={new hsl(tempToHue(min), 100,40).toString()}
					/>
					<DataPoint
						data={avg.toFixed(1) + '°C'}
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
		return new Point(index, hour.temp == undefined ? 0 : hour.temp as number)
	})
}
function roundToMultipleOf3(n: number) {
	return 3.0*Math.ceil(n/3.0)
}
function getAvgTemp(arr: Point[]) {
	const yValues = arr.map(hour => hour.y)
	return yValues.reduce((prev,current) => prev += current) / yValues.length
}
function getMinTemp(arr: Point[]) {
	return Math.min(...arr.map(hour => hour.y))
}
function getMaxTemp(arr: Point[]) {
	return Math.max(...arr.map(hour => hour.y))
}