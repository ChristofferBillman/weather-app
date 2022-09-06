import './styles/App.css'
import './styles/Type.css'

import { useState, useEffect } from 'react'

import Overview from './components/Overview'
import TransitionLifecycle, { Transition } from './components/TransitionLifecycle'
import WeatherData from './types/WeatherData'

import useFetch, {fetchRequest} from './hooks/useFetch'

import * as MockDataUntyped from './MockData.json'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as APIKEY from './ApiKey.json'
import TemperatureDetail from './components/TemperatureDetail'
import RainDetail from './components/RainDetail'
import DebugDetail from './components/DebugDetail'
import { DetailSections } from './components/DataPoint'

const MockData: WeatherData | undefined = MockDataUntyped

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UMEA = '63.826867812391846,20.263559761339305'

const DEFAULT_TRANSITION: Transition = {
	initial: { opacity: 0, transform: 'translateY(20px)' },
	transition: { opacity: 1, transform: 'translateY(0px)' },
	exit: { opacity: 0 },
	duration: 500,
}

// Test commit from vscode web

export default function App() {

	const weatherRequest: fetchRequest = getMockData()
	//getWeatherData(UMEA, APIKEY) as [WeatherData | undefined, boolean, Error | undefined]
	const [renderPage, setRenderPage] = useState<boolean>(false)
	const [selectedDataPoint, setSelectedDataPoint] = useState<DetailSections>(DetailSections.DEBUG)

	useEffect(() => {
		setRenderPage(true)
	}, [])

	const getDetailSection = (): JSX.Element => {
		switch (selectedDataPoint) {
		case DetailSections.TEMP:
			return <TemperatureDetail
				weatherRequest={weatherRequest}
				transition={DEFAULT_TRANSITION}
			/>
		case DetailSections.RAIN:
			return <RainDetail
				weatherRequest={weatherRequest}
				transition={DEFAULT_TRANSITION}
			/>
		default:
			return <DebugDetail
				weatherRequest={weatherRequest}
				transition={DEFAULT_TRANSITION}
			/>
		}
	}


	return (
		<div className='App'>
			<TransitionLifecycle
				willRender={renderPage}
				transition={DEFAULT_TRANSITION}
			>
				<div className='app-container'>
					<Overview
						weatherRequest={weatherRequest}
						transition={DEFAULT_TRANSITION}
						selectedDataPoint={selectedDataPoint}
						setSelectedDataPoint={setSelectedDataPoint}
					/>
					{getDetailSection()}
				</div>
			</TransitionLifecycle>
		</div>
	)
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getWeatherData(location: string, apikey: string): fetchRequest {
	const [lat, lon] = location.split(',')
	// eslint-disable-next-line quotes
	return useFetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`)
}

function getMockData(shouldErr = false): fetchRequest {
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

	return {data, loading, error}
}
