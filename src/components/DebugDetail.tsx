import { Transition } from './TransitionLifecycle'
import Detail from './Detail'
import Graph from './Graph'
import { fetchRequest } from '../hooks/useFetch'

interface DebugDetailProps {
	weatherRequest: fetchRequest
	transition: Transition
}

const mockData = [{x: 1, y:1},{x: 2, y:2},{x: 3, y:3}]

const HUE=256

export default function DebugDetail({ weatherRequest, transition }: DebugDetailProps): JSX.Element {
	const {data, error} = weatherRequest
	return (
		<Detail
			weatherRequest={weatherRequest}
			transition={transition}
			hue={HUE}
		>
			<Graph
				dataPoints={mockData}
				axisOptions={{
					boundX: [0,3],
					boundY: [0,3]
				}}
			/>
			{/*error ? <p>error.message</p> : <code>{JSON.stringify(data, null, 4)}</code>*/}
		</Detail>
	)
}