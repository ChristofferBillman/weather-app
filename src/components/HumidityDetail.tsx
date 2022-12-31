import HumidityIcon from '../icons/humidity.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import Graph from './Graph'
import { FetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData, { Info } from '../types/WeatherData'
import { useState } from 'react'
import HorizonalRadioSelection from './HorizonalRadioSelection'
import Point from '../types/Point'
import VSpace from './VSpace'
import Size from '../types/Size'
import timeLabels from '../types/TimeLabel'

interface TemperatureDetailProps {
	weatherRequest: FetchRequest<WeatherData>
	transition: Transition
}

export default function HumidityDetail({ weatherRequest, transition }: TemperatureDetailProps): JSX.Element {
	const {data, error, loading} = weatherRequest
	const weatherData: WeatherData = data as WeatherData

	const [selection, setSelection] = useState<string>('Relative')

	const humRelData = getHumidityPerHour(weatherData)

	const yLabels: [number,string][] = [
		[0, '0 %'],
		[25, '25 %'],
		[50, '50 %'],
		[75, '75 %'],
		[100, '100 %']
	]

	const current = weatherData?.current.humidity
	if(current == undefined) throw new Error('No current humidity found.')

	const humidities = humRelData.map((p: Point) => p.y)
	const max = Math.max(...humidities)
	const min = Math.min(...humidities)
	const avg = Math.floor(getAvg(humidities))

	if(error) return <p>error.message</p>
	
	return (
		<Detail
			loading={loading}
			transition={transition}
			hue={humidityToHue(current)}
		>
			<>
				<div className='row align-center'>
					<h1>Humidity</h1>
					<img src={HumidityIcon} className='icon-lg' />
				</div>
				
				<Graph
					dataPoints={humRelData}
					axisOptions={{xLabels: timeLabels, yLabels,boundY: [0,100], boundX: [0,24]}}
					color2={new hsl(humidityToHue(max),100,50).toString()}
					color1={new hsl(humidityToHue(min),100,50).toString()}
				/>
				
				<VSpace height={Size.SINGLE}/>

				<HorizonalRadioSelection
					items={['Relative', 'Absolute']}
					selection={selection}
					setSelection={setSelection}
					hue={humidityToHue(avg)}
				/>
				<div className='row'>
					<DataPoint
						data={current + ' %'}
						dataColor={new hsl(humidityToHue(current), 100, 40).toString()}
						label='Now'
					/>
					<div className='row'>
						<DataPoint
							data={max + ' %'}
							label='Max'
							size='sm'
							dataColor={new hsl(humidityToHue(max), 100,40).toString()}
						/>
						<DataPoint
							data={min + ' %'}
							label='Min'
							size='sm'
							dataColor={new hsl(humidityToHue(min), 100,40).toString()}
						/>
						<DataPoint
							data={avg + ' %'}
							label='Avg'
							size='sm'
							dataColor={new hsl(humidityToHue(avg), 100,40).toString()}
						/>
					</div>
				</div>
			</>
		</Detail>
	)
}

function getAvg(arr: number[]) {
	return arr.reduce((prev,current) => prev += current) / arr.length
}
function getHumidityPerHour(weatherData: WeatherData): Point[] {
	return weatherData.hourly.map((hour: Info, index: number) => {
		return new Point(index,hour.humidity == undefined ? 0 : hour.humidity)
	})
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function relativeToAbsolute(relative: number, temp: number) {
	// Accurate to 0.1% in range -30 deg C to 35 deg C.
	return (6.112 * Math.pow(Math.E, (17.67 * temp)/(temp+243.5)) * relative * 2.1674) / (273.15 + temp)
}

function humidityToHue(humidity: number): number{
	if(humidity < 20) return 56
	return humidity - 240
}