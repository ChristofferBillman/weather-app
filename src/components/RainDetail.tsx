import Waterdrop from '../icons/waterdrop.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import { FetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData, { Info } from '../types/WeatherData'
import Graph from './Graph'
import timeLabels from '../types/TimeLabel'
import Point from '../types/Point'

interface RainDetailProps {
	weatherRequest: FetchRequest<WeatherData>
	transition: Transition
}

const HUE = 223

export default function RainDetail({ weatherRequest, transition }: RainDetailProps): JSX.Element {
	const {data,error,loading} = weatherRequest
	const weatherData: WeatherData = data as WeatherData

	const rainData = getRainPerHour(weatherData)

	const yLabels: [number,string][] = [
		[0, '0 %'],
		[25, '25 %'],
		[50, '50 %'],
		[75, '75 %'],
		[100, '100 %']
	]

	const currentRainAmount = getCurrentRainAmount(weatherData)

	if(error) return <p>{error.message}</p>
	
	return (
		<Detail
			loading={loading}
			transition={transition}
			hue={HUE}
		>
			<>
				<div className='row align-center'>
					<h1>Percipication</h1>
					<img src={Waterdrop} className='icon-lg' />
				</div>

				<Graph
					dataPoints={rainData}
					color1={new hsl(HUE, 50, 50).toString()}
					color2={new hsl(HUE, 20, 60).toString()}
					axisOptions={{
						yLabels,
						xLabels: timeLabels,
						boundY: [0,25]
					}}
				/>

				<DataPoint
					data={currentRainAmount + ' mm'}
					dataColor={new hsl(HUE, 100, 40).toString()}
					label='Now'
				/>
			</>
		</Detail>
	)
}

function getRainPerHour(weatherData: WeatherData): Point[] {
	return weatherData.hourly.map((hour: Info, index: number) => {
		// TODO: Fix wierd number cast here. hour.rain is number or unknown for some reason.
		return new Point(index,hour.rain == undefined ? 0 : hour.rain as number)
	})
}

function getCurrentRainAmount(data: WeatherData) {
	return data.current.rain == undefined ? 0 : data.current.rain
}