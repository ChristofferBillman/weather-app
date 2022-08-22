import TransitionLifecycle, { Transition } from './TransitionLifecycle'
import DataPoint, { DataPointProps } from './DataPoint'
import WeatherData from '../types/WeatherData'

import Thermostat from '../icons/thermostat.svg'
import Humidity from '../icons/humidity.svg'
import Waterdrop from '../icons/waterdrop.svg'
import Wind from '../icons/wind.svg'

interface OverviewProps {
	data: WeatherData | undefined
	loading: boolean
	error: Error | undefined
	transition: Transition
	selectedDataPoint: string | undefined
	setSelectedDataPoint: (dataPoint: string | undefined) => void
}

export default function Overview({ data, loading, error, transition }: OverviewProps): JSX.Element {

	const dataPointProps: DataPointProps[] = [
		{
			data: data?.current.temp as number + '°C',
			label: 'Temperature',
			icon: Thermostat,
		},
		{
			data: data?.current.humidity + '%',
			label: 'Humidity',
			icon: Humidity,
		}, {
			data: data?.daily[0].rain === undefined ? '0mm' : data?.daily[0].rain + 'mm',
			label: 'Preciptation',
			icon: Waterdrop,
		},
		{
			data: data?.daily[0].wind_speed + 'm/s',
			label: 'Wind',
			icon: Wind,
		}
	]

	return (
		<div className='overview-container'>
			<h1>Overview</h1>
			{loading && ('Loading...')}

			<TransitionLifecycle
				willRender={!loading}
				transition={transition}
			>
				<div className='datapoints-container'>
					{error ?
						error.message
						:
						dataPointProps.map((props, index) => <DataPoint key={index} {...props} />)
					}
				</div>
			</TransitionLifecycle>
		</div>
	)
}