import { Transition } from './TransitionLifecycle'
import Detail, { hsl } from './Detail'
import Graph from './Graph'
import { fetchRequest } from '../hooks/useFetch'

interface DebugDetailProps {
	weatherRequest: fetchRequest
	transition: Transition
}

const mockData = [{x: -1, y:2},{x: -1, y:1},{x: 0, y:0},{x: 1, y:1},{x: 2, y:1},{x: 3, y: 0}, {x: 4, y: 2},{x: 5, y: 1}]

const HUE=256

export default function DebugDetail({ weatherRequest, transition }: DebugDetailProps): JSX.Element {
	const {data, error, loading} = weatherRequest
	return (
		<Detail
			loading={loading}
			transition={transition}
			hue={HUE}
		>
			<Graph
				dataPoints={mockData}
				color1={new hsl(HUE,100,50).toString()}
				color2={new hsl(HUE + 30,100,50).toString()}
			/>
			{/*error ? <p>error.message</p> : <code>{JSON.stringify(data, null, 4)}</code>*/}
		</Detail>
	)
}