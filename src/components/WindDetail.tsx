import Wind from '../icons/wind.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import { FetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData, { Info } from '../types/WeatherData'
import Graph from './Graph'
import Point from '../types/Point'

interface RainDetailProps {
	weatherRequest: FetchRequest<WeatherData>
	transition: Transition
}

const HUE = 200

export default function WindDetail({ weatherRequest, transition }: RainDetailProps): JSX.Element {
	const {data,error,loading} = weatherRequest
	const weatherData: WeatherData = data as WeatherData

	const windSpeedPerHour = getWindPerHour(weatherData)
	console.log(windSpeedPerHour)

	const currentWindSpeed = getCurrentWindSpeed(weatherData)
	const currentWindGust  = getCurrentWindGust(weatherData)
	const currentWindDeg   = getCurrentWindDeg(weatherData)

	if(error) return <p>{error.message}</p>

	return (
		<Detail
			loading={loading}
			transition={transition}
			hue={HUE}
		>
			<>
				<div className='row align-center'>
					<h1>Wind</h1>
					<img src={Wind} className='icon-lg' />
				</div>
				<Graph
					dataPoints={windSpeedPerHour}
					color1={new hsl(HUE, 50, 50).toString()}
					color2={new hsl(HUE, 20, 60).toString()}
				/>
				<div className='row' style={{flexWrap: 'wrap', justifyContent: 'space-between', width: '50%', padding: '2rem 0'}}>
					<DataPoint
						data={currentWindSpeed + ' m/s'}
						dataColor={new hsl(HUE, 100, 40).toString()}
						label='Current Speed'
						size='sm'
					/>
					<DataPoint
						data={currentWindDeg + ' -°'}
						dataColor={new hsl(HUE, 100, 40).toString()}
						label='Direction'
						size='sm'
					/>
					<DataPoint
						data={currentWindGust + ' m/s'}
						dataColor={new hsl(HUE, 100, 40).toString()}
						label='Gust'
						size='sm'
					/>
				</div>
			</>
		</Detail>
	)
}

function getWindPerHour(weatherData: WeatherData): Point[] {
	return weatherData.hourly.map((hour: Info, index: number) => {
		return new Point(index,hour.wind_speed == undefined ? 0 : hour.wind_speed)
	})
}
function getCurrentWindSpeed(data: WeatherData) {
	return data.current.wind_speed == undefined ? 0 : data.current.wind_speed
}
function getCurrentWindDeg(data: WeatherData) {
	return data.current.wind_deg == undefined ? 0 : data.current.wind_deg
}
function getCurrentWindGust(data: WeatherData) {
	return data.current.wind_gust == undefined ? 0 : data.current.wind_gust
}