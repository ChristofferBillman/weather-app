import { useEffect, useState } from 'react'

interface GraphProps {
	dataPoints: Point[]
	axisOptions?: AxisOptions
}
interface AxisOptions {
	boundX?: [number,number]
	boundY?: [number,number]
}
interface Point{
	[key: string]: number
	x: number
	y: number
}

const HEIGHT = 256
const WIDTH = 256 * 2

export default function Graph({dataPoints, axisOptions}: GraphProps) {

	const [boundX, setBoundX] = useState<[number,number]>()
	const [boundY, setBoundY] = useState<[number,number]>()

	const [numRows, setNumRows] = useState<number>(10)
	const [numCols, setNumCols] = useState<number>(20)

	const handleNoBounds = (setter: React.Dispatch<React.SetStateAction<[number, number] | undefined>>, axis: string) => {
		const max = Math.max(...dataPoints.map((point: Point) => point[axis]))
		const min = Math.min(...dataPoints.map((point: Point) => point[axis]))
		setter([min,max])
	}

	const drawGraph = () =>{
		return (
			<svg height={HEIGHT + 10} width={WIDTH + 10}>
				<path
					stroke='black'
					fill='none'
					strokeWidth='7'
					d={getPath()}
				/>
			</svg>
		)
	}
	const getPath = () =>{
		if(boundX === undefined || boundY === undefined) return
		let pathString = ''
		for(let i = 0; i < dataPoints.length; i++){
			const pixelPos = coordToPx(dataPoints[i])
			if(i === 0) {
				pathString += `M0 ${HEIGHT} L${pixelPos.x} ${pixelPos.y} `
				continue
			}
			const lastPixelPos = coordToPx(dataPoints[i-1])
			pathString+= `M${lastPixelPos.x} ${lastPixelPos.y} L${pixelPos.x} ${pixelPos.y} `
		}
		return pathString
	}
	const coordToPx = (p: Point): Point => {
		if(boundX === undefined || boundY === undefined) throw new Error('coordToPx was called before boundX or boundY was defined.')
		return {x: p.x * WIDTH / boundX[1], y: HEIGHT - (p.y * HEIGHT / boundY[1])}
	}

	useEffect(() => {
		if(axisOptions === undefined){
			handleNoBounds(setBoundX, 'x')
			handleNoBounds(setBoundY, 'y')
			return
		}
		if(axisOptions.boundX === undefined) handleNoBounds(setBoundX, 'x')
		else setBoundX(axisOptions.boundX)
		if(axisOptions.boundY === undefined) handleNoBounds(setBoundY, 'y')
		else setBoundY(axisOptions.boundY)
	},[])

	const renderGrid = (): JSX.Element => {
		return (
			<>
				{[...Array(numCols)].map((e, i) => {
					if(i !== 0) return <Line key={i} direction='horizontal' offset={WIDTH/numCols * i}/>
				})}
				{[...Array(numRows)].map((e, i) => {
					if(i !== 0) return <Line key={i} direction='vertical' offset={HEIGHT/numRows * i}/>
				})}
			</>
		)
	}

	return (
		<div className='graph-container' style={{width: WIDTH + 'px', height: HEIGHT + 'px'}}>
			{renderGrid()}
			{drawGraph()}
		</div>
	)
}

interface LineProps{
	direction: 'vertical' | 'horizontal'
	offset: number
}
function Line({direction, offset}: LineProps): JSX.Element{
	if(direction === 'vertical')
		return <div className='line' style={{width: WIDTH + 'px', height: '2px', top: offset + 'px'}}/>
	else return (
		<div className='line' style={{height: HEIGHT + 'px', width: '2px',left: offset + 'px'}}/>
	)
}