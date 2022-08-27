import { useEffect, useState } from 'react'
import { hsl } from './Detail'

interface GraphProps {
	dataPoints: Point[]
	axisOptions?: AxisOptions
	color1: string
	color2: string
}
interface AxisOptions {
	boundX?: [number,number]
	boundY?: [number,number]
	labels?: {x: string, y: string}[]
}
export interface Point{
	[key: string]: number
	x: number
	y: number
}

const HEIGHT = 256
const WIDTH = 256 * 2
// dataPoints / LINES is the number of lines shown.
const LINES = 4

export default function Graph({dataPoints, axisOptions, color1, color2}: GraphProps) {

	const [boundX, setBoundX] = useState<[number,number]>()
	const [boundY, setBoundY] = useState<[number,number]>()

	const handleNoBounds = (setter: React.Dispatch<React.SetStateAction<[number, number] | undefined>>, axis: string) => {
		const max = Math.max(...dataPoints.map((point: Point) => point[axis]))
		const min = Math.min(...dataPoints.map((point: Point) => point[axis]))
		setter([min,max])
	}

	const drawGraph = () =>{
		const axisLabels = getAxisLabels()
		if(axisLabels === undefined) return 
		return (
			<svg height={HEIGHT +30} width={WIDTH + 20} style={{zIndex: 1}}>
				<defs>
					<linearGradient id='gradient' x1="0.5" y1="1" x2="0.5" y2="0">
						<stop offset="0%" stopColor={color1}/>
						<stop offset="100%" stopColor={color2}/>
					</linearGradient>
				</defs>
				<path
					stroke={new hsl(0,0,90).toString()}
					fill='none'
					strokeLinecap='round'
					strokeWidth='2'
					d={getLines()}
				/>
				{axisLabels.map((labels: {x: JSX.Element, y: JSX.Element}) => <> {labels.x} {labels.y} </>)}
				<path
					stroke='url(#gradient)'
					fill='none'
					strokeLinecap='round'
					strokeWidth='7'
					d={getPath()}
				/>
			</svg>
		)
	}
	const getAxisLabels = () => {
		if(axisOptions?.labels === undefined) return
		const labels: {x: JSX.Element, y: JSX.Element}[] = []
		for(let i = 0; i < dataPoints.length; i++) {
			if(i % LINES !== 0) continue
			if(i === 0) continue
			const currentPos: Point = {
				x: WIDTH/dataPoints.length * i,
				y: HEIGHT/dataPoints.length * i
			}
			labels[i] = {
				x: <text
					x={currentPos.x - 9}
					y={HEIGHT + 20}
					fill='gray'
					className='graph-label'
				>
					{axisOptions.labels[i].x}
				</text>,
				y: <text
					x={0}
					y={currentPos.y}
					fill='gray'
					className='graph-label'
				>
					{axisOptions.labels[i].y}
				</text>
			}
		}
		return labels
	}
	const getLines = () => {
		const vLine = 'v ' + HEIGHT
		const hLine = 'h ' + WIDTH
		let pathStringX = 'M0 0'
		let pathStringY = 'M0 0'
		for(let i = 0; i < dataPoints.length; i++) {
			if(i % LINES !== 0) continue
			if(i === 0) continue
			const currentPos: Point = {
				x: WIDTH/dataPoints.length * i,
				y: HEIGHT/dataPoints.length * i
			}
			pathStringX += `M${currentPos.x} 0 ${vLine}`
			pathStringY += `M0 ${currentPos.y} ${hLine}` 
		}
		return pathStringY +' '+ pathStringX
	}

	const getPath = () =>{
		if(boundX === undefined || boundY === undefined) return
		let pathString = ''
		for(let i = 0; i < dataPoints.length; i++){
			const pixelPos = coordToPx(dataPoints[i])
			const cOne = coordToPx({x: dataPoints[i].x, y: dataPoints[i].y})
			const cTwo = coordToPx({x: dataPoints[i].x, y: dataPoints[i].y})
			if(i === 0) {
				pathString += `M${0} ${HEIGHT} C${cOne.x},${cOne.y} ${cTwo.x},${cTwo.y} ${pixelPos.x},${pixelPos.y} `
				continue
			}
			const lastPixelPos = coordToPx(dataPoints[i-1])

			pathString+= `M${lastPixelPos.x},${lastPixelPos.y} C${cOne.x},${cOne.y} ${cTwo.x},${cTwo.y} ${pixelPos.x},${pixelPos.y} `
		}
		return pathString
	}
	const coordToPx = (p: Point): Point => {
		if(boundX === undefined || boundY === undefined) throw new Error('coordToPx was called before boundX or boundY was defined.')
		// Convert coordinate step to pixels.
		const dx = WIDTH / Math.abs(boundX[0] - boundX[1])
		const dy = HEIGHT / Math.abs(boundY[0]-boundY[1])
		// Offset beginning of graph to 0 when coordinates are negative.
		const nOffsetX = Math.abs(boundX[0])*dx
		const nOffsetY = Math.abs(boundY[0])*dy
		return {x: p.x * dx + nOffsetX, y: HEIGHT - (p.y * dy) + nOffsetY}
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

	return (
		<div className='graph-container' style={{width: WIDTH + 'px', height: HEIGHT + 'px'}}>
			{drawGraph()}
		</div>
	)
}