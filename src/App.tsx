import './styles/App.css'
import './styles/Type.css'

import { useState, useEffect } from 'react'

import DataPoint from './components/DataPoint'

import useFetch from './hooks/useFetch'

import Thermostat from './icons/thermostat.svg'
import Humidity from './icons/humidity.svg'
import Waterdrop from './icons/waterdrop.svg'
import Wind from './icons/wind.svg'

import * as MockData from './MockData.json'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const APIKEY = '1a87f44fa0405437594d18b5815bcaa8'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UMEA = '63.826867812391846, 20.263559761339305'

const DataPointProps = [
	{
		data: '20',
		label: 'Temperature',
		icon: Thermostat,
	},
	{
		data: '0',
		label: 'Humidity',
		icon: Humidity,
	}, {
		data: '0',
		label: 'Preciptation',
		icon: Waterdrop,
	},
	{
		data: '0',
		label: 'Wind',
		icon: Wind,
	}
]

export default function App() {

	const [weatherData, loading, error] = getMockData()

	return (
		<div className='App'>
			<div className='app-container'>
				<div className='overview-container'>
					<h1>Overview</h1>
					<div className='datapoints-container'>
						{DataPointProps.map((props, index) => <DataPoint key={index} {...props} />)}
					</div>
				</div>
				<div className='detail-container'>
					<h1>Detail</h1>
					<code>
						{loading ? ('Loading...') :
							error ? 'Something went wrong.' :
								JSON.stringify(weatherData, null, 4)
						}
					</code>
				</div>
			</div>
		</div>
	)
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getWeatherData(lat: string, lon: string, apikey: string) {
	// eslint-disable-next-line quotes
	return useFetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`)
}

function getMockData(shouldErr = false) {
	const [data, setData] = useState<unknown>()
	const [error, setError] = useState<Error | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		setLoading(true)

		setTimeout(() => {
			if (shouldErr) {
				setError(new Error('Something went wrong'))
				return
			}
			setData(MockData)
			console.log(MockData)
			setLoading(false)
		}, 1500)
	}, [])

	useEffect(() => {
		if (error || data)
			setLoading(false)
	}, [data, error])

	return [data, loading, error]
}
