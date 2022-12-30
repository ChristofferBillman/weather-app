import HumidityIcon from '../icons/humidity.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import Graph, {Point} from './Graph'
import { FetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData, { DailyTemp } from '../types/WeatherData'
import { useEffect, useState } from 'react'
import HorizonalRadioSelection from './HorizonalRadioSelection'

interface TemperatureDetailProps {
	weatherRequest: FetchRequest<WeatherData>
	transition: Transition
}

export default function HumidityDetail({ weatherRequest, transition }: TemperatureDetailProps): JSX.Element {
	const {data, error, loading} = weatherRequest
	const typedData: WeatherData = data as WeatherData

	const [selection, setSelection] = useState<string>('Relative')

	useEffect(() => {
		if(selection == 'Relative') {
			// ok
		} else {
			// 
		}
	},[selection])

	// Remove all decimals after first one and cast to int.
	const humitities: number[] = []
	const absHumidities: number[] = []

	typedData.hourly.forEach(hour => {
		humitities.push(hour.humidity == undefined ? 0 : hour.humidity)
		absHumidities.push(relativeToAbsolute(hour.humidity == undefined ? 0 : hour.humidity, Number((((typedData?.daily[0].temp as DailyTemp).day) as number).toFixed(1))))
	})
	const current = typedData?.current.humidity as number
	const max = Math.max(...humitities)
	const min = Math.min(...humitities)
	const avg = Math.floor(humitities.reduce((prev,current) => prev += current) / humitities.length)
	const avgAbs = Math.floor(absHumidities.reduce((prev,current) => prev += current) / absHumidities.length)


	const [humRelData, setHumRelData] = useState<Point[]>([])
	const [humAbsData, setHumAbsData] = useState<Point[]>([])

	const [relLabels, setRelLabels] = useState<{x: string, y: string}[]>([])
	const [absLabels, setAbsLabels] = useState<{x: string, y: string}[]>([])


	useEffect(() =>{
		const relHum: Point[] = []
		const absHum: Point[] = []
		const relLabels = []
		const absLabels = []
		const firstHourInData = new Date((typedData.hourly[0].dt + typedData.timezone_offset)*1000).getHours()

		for(let i = 0; i < typedData.hourly.length/2; i++) {
			const currentHour = (firstHourInData + i) % 24
			let xLabel = ''

			if(currentHour <= 9) {
				xLabel = '0' + currentHour
			}
			else{
				xLabel = String(currentHour)
			}
			relLabels[i] = {
				x: xLabel,
				y: String(Math.ceil(typedData.hourly[i].humidity as number))
			}
			relHum[i] = {
				x: i,
				y: typedData.hourly[i].humidity as number
			}

			const absHumVal = relativeToAbsolute(typedData.hourly[i].humidity as number, typedData.hourly[i].temp as number)
			absLabels[i] = {
				x: xLabel,
				y: String(Math.ceil(absHumVal))
			}
			absHum[i] = {
				x: i,
				y: relativeToAbsolute(typedData.hourly[i].humidity as number, typedData.hourly[i].temp as number)
			}
		}
		setHumRelData(relHum)
		setHumAbsData(absHum)
		setRelLabels(relLabels)
		setAbsLabels(absLabels)

		console.log(absHum)
	},[])
	
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
				{error ?
					error.message
					:
					<>
						{selection == 'Relative' ? (
							<Graph
								dataPoints={ humRelData}
								axisOptions={{labels: relLabels, boundY: [0,100]}}
								color2={new hsl(humidityToHue(max),100,50).toString()}
								color1={new hsl(humidityToHue(min),100,50).toString()}
							/>
						) : (
							<Graph
								dataPoints={humAbsData}
								axisOptions={{labels: absLabels, boundY: [0,20]}}
								color2={new hsl(humidityToHue(max),100,50).toString()}
								color1={new hsl(humidityToHue(min),100,50).toString()}
							/>
						)}
						
						<div className='vspace'/>
						<HorizonalRadioSelection
							items={['Relative', 'Absolute']}
							selection={selection}
							setSelection={setSelection}
							hue={humidityToHue(avg)}
						/>
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
								data={selection == 'Relative' ? avg + ' %' : avgAbs + ' g/m^3'}
								label='Avg'
								size='sm'
								dataColor={new hsl(humidityToHue(avg), 100,40).toString()}
							/>
						</div>
					</>
				}
			</>
		</Detail>
	)
}

function relativeToAbsolute(relative: number, temp: number) {
	// Accurate to 0.1% in range -30 deg C to 35 deg C.
	return (6.112 * Math.pow(Math.E, (17.67 * temp)/(temp+243.5)) * relative * 2.1674) / (273.15 + temp)
}

function humidityToHue(humidity: number): number{
	if(humidity < 20) return 56
	return humidity - 240
}