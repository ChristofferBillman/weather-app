import './styles/App.css'
import './styles/Type.css'

import { useState, useEffect } from 'react'

import Overview from './components/Overview'
import TransitionLifecycle, { Transition } from './components/TransitionLifecycle'
import WeatherData from './types/WeatherData'

import useFetch from './hooks/useFetch'

import * as MockDataUntyped from './MockData.json'
import TemperatureDetail from './components/TemperatureDetail'
const MockData: WeatherData | undefined = MockDataUntyped

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const APIKEY = '1a87f44fa0405437594d18b5815bcaa8'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UMEA = '63.826867812391846,20.263559761339305'

const DEFAULT_TRANSITION: Transition = {
	initial: { opacity: 0, transform: 'translateY(20px)' },
	transition: { opacity: 1, transform: 'translateY(0px)' },
	exit: { opacity: 0 },
	duration: 500,
}

export default function App() {

	const [weatherData, loading, error] = getMockData()
	//getWeatherData(UMEA, APIKEY) as [WeatherData | undefined, boolean, Error | undefined]
	const [renderPage, setRenderPage] = useState<boolean>(false)
	const [selectedDataPoint, setSelectedDataPoint] = useState<string | undefined>(undefined)

	useEffect(() => {
		setRenderPage(true)
	}, [])

	return (
		<div className='App'>
			<TransitionLifecycle
				willRender={renderPage}
				transition={DEFAULT_TRANSITION}
			>
				<div className='app-container'>
					<Overview
						data={weatherData}
						loading={loading}
						error={error}
						transition={DEFAULT_TRANSITION}
						selectedDataPoint={selectedDataPoint}
						setSelectedDataPoint={setSelectedDataPoint}
					/>
					<TemperatureDetail
						data={weatherData}
						loading={loading}
						error={error}
						transition={DEFAULT_TRANSITION}
					/>
				</div>
			</TransitionLifecycle>
		</div>
	)
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getWeatherData(location: string, apikey: string): [unknown | undefined, boolean, Error | undefined] {
	const [lat, lon] = location.split(',')
	// eslint-disable-next-line quotes
	return useFetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`)
}

function getMockData(shouldErr = false): [WeatherData | undefined, boolean, Error | undefined] {
	const [data, setData] = useState<WeatherData>()
	const [error, setError] = useState<Error | undefined>(undefined)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		setLoading(true)

		setTimeout(() => {
			if (shouldErr) {
				setError(new Error('Unable to fetch data.'))
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
