import HumidityIcon from '../icons/humidity.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import Graph from './Graph'
import { FetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData, { Info } from '../types/WeatherData'
import { useEffect, useState } from 'react'
import HorizonalRadioSelection from './HorizonalRadioSelection'
import Point from '../types/Point'
import VSpace from './VSpace'
import Size from '../types/Size'
import TimeLabels from '../types/TimeLabel'

interface TemperatureDetailProps {
	weatherRequest: FetchRequest<WeatherData>
	transition: Transition
}

export default function HumidityDetail({ weatherRequest, transition }: TemperatureDetailProps): JSX.Element {
	const {data, error, loading} = weatherRequest
	const weatherData: WeatherData = data as WeatherData

	const [selection, setSelection] = useState<string>('Relative')
	
	const isRelative = () => selection == 'Relative'

	const date = new Date((weatherData.hourly[0].dt + weatherData.timezone_offset) * 1000)
	const startHour = date.getHours()

	const xLabels = TimeLabels.getLabels(3,startHour, startHour + 24)

	const tempPerHour = getTempPerHour(weatherData)
	const humRelData = getHumidityPerHour(weatherData)

	const current = weatherData?.current.humidity

	let humData, max, min, avg
	let yLabels  : [number, string][]
	let boundY   : [number, number]
	const boundX : [number, number] = [0,24]

	/* RELATIVE DATA */
	if(isRelative()) {
		console.log('got inside!')
		const humidities = humRelData.map((p: Point) => p.y)
		humData = humRelData

		max = Math.max(...humidities)
		min = Math.min(...humidities)
		avg = Math.floor(getAvg(humidities))

		yLabels = [
			[0, '0 %'],
			[25, '25 %'],
			[50, '50 %'],
			[75, '75 %'],
			[100, '100 %']
		]
		boundY = [0,100]
	}
	/* ABSOLUTE DATA */
	else {
		humData =  humRelData.map((p: Point, i: number) => new Point(i, relativeToAbsolute(p.y,tempPerHour[i].y)))
		const humiditiesAbs = humData.map((p: Point) => p.y)

		max = Math.max(...humiditiesAbs)
		min = Math.min(...humiditiesAbs)
		avg = Math.floor(getAvg(humiditiesAbs))

		yLabels = [
			[0      , '0'],
			[min    , min.toFixed(1) + ' g/m3'],
			[avg    , String(avg.toFixed(1))],
			[max    , String(max.toFixed(1))],
			[max + 2, String((max+2).toFixed(1))],
			[max + 2, String(max+2)]
		]
		boundY = [min-1,max+1]
	}

	if(current == undefined) throw new Error('No current humidity found.')

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
				<div className='detail-content-container'>
					<Graph
						dataPoints={humData}
						axisOptions={{xLabels, yLabels, boundY, boundX}}
						color2={new hsl(humidityToHue(100),100,50).toString()}
						color1={new hsl(humidityToHue(0),100,50).toString()}
					/>
					
					<VSpace height={Size.SINGLE}/>

					<HorizonalRadioSelection
						items={['Relative', 'Absolute']}
						selection={selection}
						setSelection={setSelection}
						hue={humidityToHue(current)}
					/>
					<div className='row'>
						<DataPoint
							data={isRelative() ? current + ' %' : 'N/A'}
							dataColor={new hsl(humidityToHue(current), 100, 40).toString()}
							label='Now'
						/>
						<DataPoint
							data={max.toFixed(1) + (isRelative() ? ' %' : ' g/m3')}
							label='Max'
							size='sm'
							dataColor={new hsl(humidityToHue(current), 100,40).toString()}
						/>
						<DataPoint
							data={min.toFixed(1) + (isRelative() ? ' %' : ' g/m3')}
							label='Min'
							size='sm'
							dataColor={new hsl(humidityToHue(current), 100,40).toString()}
						/>
						<DataPoint
							data={avg.toFixed(1) + (isRelative() ? ' %' : ' g/m3')}
							label='Avg'
							size='sm'
							dataColor={new hsl(humidityToHue(current), 100,40).toString()}
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

function getTempPerHour(weatherData: WeatherData): Point[] {
	return weatherData.hourly.map((hour: Info, index: number) => {
		return new Point(index, hour.temp == undefined ? 0 : hour.temp as number)
	})
}

function humidityToHue(humidity: number): number{
	if(humidity < 20) return 56
	return humidity - 240
}