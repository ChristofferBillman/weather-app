import Waterdrop from '../icons/waterdrop.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import { FetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData from '../types/WeatherData'
import Graph, { Point } from './Graph'
import { useEffect, useState } from 'react'

interface RainDetailProps {
	weatherRequest: FetchRequest<WeatherData>
	transition: Transition
}

const HUE = 223

export default function RainDetail({ weatherRequest, transition }: RainDetailProps): JSX.Element {
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
			let rainAmount
			
			if(typedData.hourly[i].rain === undefined){
				rainAmount = 0
			}
			else{
				rainAmount = typedData.hourly[i].rain as number
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
				y: rainAmount
			}
		}
		setRainData(arr)
		setRainDataLabels(labels)
	},[])
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
						labels: rainDataLabels,
						boundY: [0,25]
					}}
				/>
				{error ?
					error.message
					:
					<DataPoint
						data={typedData?.current.rain ? typedData?.current.rain + 'mm' : '0mm'}
						dataColor={new hsl(HUE, 100, 40).toString()}
						label='Now'
					/>
				}
			</>
		</Detail>
	)
}