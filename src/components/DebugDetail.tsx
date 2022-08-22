import TransitionLifecycle, { Transition } from './TransitionLifecycle'
import WeatherData from '../types/WeatherData'

interface DetailProps {
	data: WeatherData | undefined
	loading: boolean
	error: Error | undefined
	label: string
	icon?: string
	color?: string
	transition: Transition
}

export default function DebugDetail({ data, loading, error, label, icon, color, transition }: DetailProps): JSX.Element {
	return (
		<div className='detail-container'>
			<div className='row align-center'>
				<h1>{label}</h1>
				<img src={icon} className='icon-sm' />
			</div>
			<code>
				{loading && ('Loading...')}

				<TransitionLifecycle
					willRender={!loading}
					transition={transition}
					verbose={true}
				>
					{error ? error.message : JSON.stringify(data, null, 4)}
				</TransitionLifecycle>
			</code>
		</div>
	)
}