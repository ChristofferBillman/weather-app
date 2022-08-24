import TransitionLifecycle, { Transition } from './TransitionLifecycle'
import { fetchRequest } from '../hooks/useFetch'

interface DetailProps {
	weatherRequest: fetchRequest
	transition: Transition
	children: JSX.Element | JSX.Element[]
	hue?: number
}

export class hsl {
	h: number
	s: number
	l: number

	constructor(h: number, s: number, l: number) {
		this.h = h
		this.s = s
		this.l = l
	}
	public toString(): string {
		return `hsl(${this.h}, ${this.s}%, ${this.l}%)`
	}
}

export default function TemperatureDetail({ weatherRequest, transition, children, hue }: DetailProps): JSX.Element {
	const {loading} = weatherRequest
	return (
		<div className='detail-container' style={{ backgroundColor: hue ? new hsl(hue, 100, 96).toString(): 'white' }}>
			{loading && ('Loading...')}

			<TransitionLifecycle
				willRender={!loading}
				transition={transition}
				verbose={true}
			>
				{children}
			</TransitionLifecycle>
		</div>
	)
}