import TransitionLifecycle, { Transition } from './TransitionLifecycle'
import DataPoint, { DataPointProps, DetailSections } from './DataPoint'
import WeatherData from '../types/WeatherData'

import Thermostat from '../icons/thermostat.svg'
import Humidity from '../icons/humidity.svg'
import Waterdrop from '../icons/waterdrop.svg'
import Wind from '../icons/wind.svg'
import { FetchRequest } from '../hooks/useFetch'

interface OverviewProps {
	weatherRequest: FetchRequest<WeatherData>
	transition: Transition
	selectedDataPoint: DetailSections
	setSelectedDataPoint: (dataPoint: DetailSections) => void
}

export default function Overview({ weatherRequest, transition, setSelectedDataPoint}: OverviewProps): JSX.Element {

	const {data, loading, error} = weatherRequest
	const typedData: WeatherData = data as WeatherData

	const dataPointProps: DataPointProps[] = [
		{
			data: typedData?.current.temp as number + '°C',
			label: 'Temperature',
			icon: Thermostat,
			hasSection: DetailSections.TEMP
		},
		{
			data: typedData?.current.humidity + '%',
			label: 'Humidity',
			icon: Humidity,
			hasSection: DetailSections.HUMIDITY
		}, {
			data: typedData?.daily[0].rain === undefined ? '0mm' : typedData?.daily[0].rain + 'mm',
			label: 'Preciptation',
			icon: Waterdrop,
			hasSection: DetailSections.RAIN
		},
		{
			data: typedData?.daily[0].wind_speed + 'm/s',
			label: 'Wind',
			icon: Wind,
			hasSection: DetailSections.DEBUG
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
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						dataPointProps.map((p, index) => <DataPoint key={index} onClick={() => {setSelectedDataPoint(p.hasSection!)}} {...p} />)
					}
				</div>
			</TransitionLifecycle>
		</div>
	)
}