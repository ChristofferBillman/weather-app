import { Transition } from './TransitionLifecycle'
import Detail from './Detail'
import { fetchRequest } from '../hooks/useFetch'

interface DebugDetailProps {
	weatherRequest: fetchRequest
	transition: Transition
}

const HUE=256

export default function DebugDetail({ weatherRequest, transition }: DebugDetailProps): JSX.Element {
	const {data, error} = weatherRequest
	return (
		<Detail
			weatherRequest={weatherRequest}
			transition={transition}
			hue={HUE}
		>
			{error ? <p>error.message</p> : <code>{JSON.stringify(data, null, 4)}</code>}
		</Detail>
	)
}