import './styles/App.css'
import './styles/Type.css'

import { useState, useEffect } from 'react'

import Overview from './components/Overview'
import TransitionLifecycle, { Transition } from './components/TransitionLifecycle'
import WeatherData from './types/WeatherData'

import useFetch, { FetchRequest } from './hooks/useFetch'

//import * as MockDataUntyped from './MockData.json'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import APIKEY from './ApiKey'
import mockData from './MockData.json'
import TemperatureDetail from './components/TemperatureDetail'
import RainDetail from './components/RainDetail'
import WindDetail from './components/WindDetail'
import DebugDetail from './components/DebugDetail'
import { DetailSections } from './components/DataPoint'
import HumidityDetail from './components/HumidityDetail'

//const MockData: WeatherData | undefined = MockDataUntyped

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UMEA = '63.826867812391846,20.263559761339305'

const DEFAULT_TRANSITION: Transition = {
	initial: { opacity: 0, transform: 'translateY(20px)' },
	transition: { opacity: 1, transform: 'translateY(0px)' },
	exit: { opacity: 0 },
	duration: 500,
}

export default function App() {
	const [renderPage, setRenderPage] = useState<boolean>(false)
	const [selectedDataPoint, setSelectedDataPoint] = useState<DetailSections>(DetailSections.DEBUG)

	const [lat, lon] = UMEA.split(',')

	const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat as string}&lon=${lon as string}&appid=${APIKEY}&units=metric`
	//console.log(url)
	const weatherRequest = getMockData() //useFetch<any>(url)

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
		case DetailSections.WIND:
			return <WindDetail
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


function getMockData(shouldErr = false): FetchRequest<WeatherData> {
	const [data, setData] = useState<WeatherData | undefined>()
	const [error, setError] = useState<Error | undefined>(undefined)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		setLoading(true)

		setTimeout(() => {
			if (shouldErr) {
				setError(new Error('Unable to fetch data.'))
				return
			}
			setData(mockData)
			console.log(mockData)
			setLoading(false)
		}, 1500)
	}, [])

	useEffect(() => {
		if (error || data)
			setLoading(false)
	}, [data, error])

	return {data, loading, error}
}
