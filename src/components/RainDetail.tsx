import Waterdrop from '../icons/waterdrop.svg'
import DataPoint from './DataPoint'
import Detail,{hsl} from './Detail'
import { FetchRequest } from '../hooks/useFetch'
import {Transition} from './TransitionLifecycle'
import WeatherData from '../types/WeatherData'
import { type } from '@testing-library/user-event/dist/type'

interface RainDetailProps {
	weatherRequest: FetchRequest<WeatherData>
	transition: Transition
}

const HUE = 223

export default function RainDetail({ weatherRequest, transition }: RainDetailProps): JSX.Element {
	const {data,error,loading} = weatherRequest
	const typedData: WeatherData = data as WeatherData

	let rainAmount: number | unknown= typedData.current.rain
	if(typedData?.current.rain == undefined) {
		rainAmount = 0
	}

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
				{error ?
					error.message
					:
					<DataPoint
						data={rainAmount + ' mm'}
						dataColor={new hsl(HUE, 100, 40).toString()}
						label='Now'
					/>
				}
			</>
		</Detail>
	)
}