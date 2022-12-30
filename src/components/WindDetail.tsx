import Wind from '../icons/wind.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import { fetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData from '../types/WeatherData'
import Graph, { Point } from './Graph'
import { useEffect, useState } from 'react'

interface RainDetailProps {
	weatherRequest: fetchRequest
	transition: Transition
}

const HUE = 200

export default function WindDetail({ weatherRequest, transition }: RainDetailProps): JSX.Element {
	const {data,error,loading} = weatherRequest
	const typedData: WeatherData = data as WeatherData

	const [rainData, setRainData] = useState<Point[]>([])
	const [rainDataLabels, setRainDataLabels] = useState<{x: string, y: string}[]>([])

	useEffect(() =>{
		const firstHourInData = new Date((typedData.hourly[0].dt + typedData.timezone_offset)*1000).getHours()
		const arr = []
		const labels = []
		
		for(let i = 0; i < typedData.hourly.length/2; i++) {
			const currentHour = (firstHourInData + i) % 24
			let xLabel = ''
			let wind
			
			if(typedData.hourly[i].wind_speed === undefined){
				wind = 0
			}
			else{
				wind = typedData.hourly[i].wind_speed as number
			}

			if(currentHour <= 9){
				xLabel = '0' + currentHour
			}
			else{
				xLabel = String(currentHour)
			}

			labels[i] = {
				x: xLabel,
				y: String(i * 2)
			}
			arr[i] = {
				x: i,
				y: wind
			}
		}
		setRainData(arr)
		setRainDataLabels(labels)
	},[])

	const degToDirection = () => {
		return 0
	}

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
					dataPoints={rainData}
					color1={new hsl(HUE, 50, 50).toString()}
					color2={new hsl(HUE, 20, 60).toString()}
					axisOptions={{
						labels: rainDataLabels,
						boundY: [0,25]
					}}
				/>
				{error ?
					error.message
					:
					<div className='row' style={{flexWrap: 'wrap', justifyContent: 'space-between', width: '50%', padding: '2rem 0'}}>
						<DataPoint
							data={typedData?.current.wind_speed ? typedData?.current.wind_speed + 'm/s' : '0m/s'}
							dataColor={new hsl(HUE, 100, 40).toString()}
							label='Current Speed'
							size='sm'
						/>
						<DataPoint
							data={typedData?.current.wind_deg ? typedData?.current.wind_deg + '°' : '-°'}
							dataColor={new hsl(HUE, 100, 40).toString()}
							label='Direction'
							size='sm'
						/>
						<DataPoint
							data={typedData?.current.wind_gust ? typedData?.current.wind_gust + 'm/s' : '0m/s'}
							dataColor={new hsl(HUE, 100, 40).toString()}
							label='Gust'
							size='sm'
						/>
					</div>
				}
			</>
		</Detail>
	)
}