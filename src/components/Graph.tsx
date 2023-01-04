import { useLayoutEffect } from 'react'
import Point from '../types/Point'

interface GraphProps {
	dataPoints: Point[]
	axisOptions?: AxisOptions
	color1: string
	color2: string
}
interface AxisOptions {
	boundX?: [number,number]
	boundY?: [number,number]
	xLabels?: [number, string][]
	yLabels?: [number, string][]
}

// TODO: Labels are in wrong order. FIXED.
//       Labels are wrong when boundY is set explicitly. FIXED.
//       Negative values are not reflected in graph. Min is 0 apperently. FIXED.
//       Rework this shit so x and y labels can be independent of each other. FIXED.
//       Auto generate labels when omitted.
//       Graph shows up outside svg when above a certain value. > 6 for mock temp data. FIXED.

let HEIGHT = 312
let WIDTH = HEIGHT * 2
// dataPoints / LINES is the number of lines shown.

export default function Graph({dataPoints, axisOptions, color1, color2}: GraphProps) {

	let boundX = axisOptions?.boundX
	let boundY = axisOptions?.boundY

	// Make the graph bounds the max and min values in the data.
	const generateBounds = (data: number[]): [number, number] => {
		const max = Math.max(...data)
		const min = Math.min(...data)
		return [min,max]
	}
	// If boundX is not specified.
	if(boundX === undefined) boundX = generateBounds(dataPoints.map(p => p.x))
	// If boundY is not specified.
	if(boundY === undefined) boundY = generateBounds(dataPoints.map(p => p.y))

	// Make fit graph to viewport width if on mobile.
	useLayoutEffect(() => {
		if(window.innerWidth > 768) return
		WIDTH = window.innerWidth-10
		HEIGHT = WIDTH / 2
	})

	/**
	 * Draws SVG for the graph.
	 * @returns The svg with drawn graph.
	 */
	const drawGraph = () =>{
		const axisLabels = getLabelElements(axisOptions?.xLabels, axisOptions?.yLabels)
		const lines = getLines(axisOptions?.xLabels, axisOptions?.yLabels)

		return (
			<svg height={HEIGHT} width={WIDTH} style={{paddingBottom: '24px'}}>
				<defs>
					<linearGradient id='gradient' x1="0.5" y1="1" x2="0.5" y2="0">
						<stop offset="0%" stopColor={color1}/>
						<stop offset="100%" stopColor={color2}/>
					</linearGradient>
				</defs>
				{lines}
				{axisLabels}
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

	/**
	 * Generates the text nodes that contain the labels.
	 * @param xLabels The placement along the X-axis and the label text.
	 * @param yLabels The placement along the Y-axis and the label text.
	 * @returns Text nodes with the labels with placement set.
	 */
	const getLabelElements = (
		xLabels: [number, string][] | undefined,
		yLabels: [number, string][] | undefined):
		JSX.Element[]  => {

		// Set default labels if they weren't provided. Not done yet.
		if(xLabels == undefined) {
			xLabels = [[0, '0']]
		}
		if(yLabels == undefined) {
			yLabels = [[0, '0']]
		}

		const xLabelElements = xLabels.map((label: [number, string]) => (
			<text
				key={label[1]}
				x={xToPx(label[0])+5}
				y={HEIGHT}
				fill='gray'
				className='graph-label'
			>
				{label[1]}
			</text>
		))

		const yLabelElements = yLabels.map((label: [number, string]) => (
			<text
				key={label[1]}
				x={0}
				y={yToPx(label[0]) + 15}
				fill='gray'
				className='graph-label'
			>
				{label[1]}
			</text>
		))

		// Remove first and last labels. Only for aestetic reasons.
		yLabelElements.shift()
		xLabelElements.shift()
		yLabelElements.pop()
		xLabelElements.pop()

		return xLabelElements.concat(yLabelElements)
	}
	/**
	 * Get
	 * @param xLabels The labels provided from props.
	 * 				  Tells getLines where to place them along the X-axis.
	 * @param yLabels The labels provided from props.
	 * 				  Tells getLines where to place them along the Y-axis.
	 * @returns Line nodes with placement set.
	 */
	const getLines = (
		xLabels: [number, string][] | undefined,
		yLabels: [number, string][] | undefined) => {

		// Set default labels if they weren't provided.
		if(xLabels == undefined) {
			xLabels = [[0, '0'], [4, '4'], [23, '5'],[6, '6']]
		}
		if(yLabels == undefined) {
			yLabels = [[0, '0'], [4,'4']]
		}

		const xLines= xLabels.map((label: [number, string]) => (
			<line
				key={label[1]}
				x1={xToPx(label[0])}
				y1={0}
				x2={xToPx(label[0])}
				y2={HEIGHT}
				className='graph-line'
			/>
		))

		const yLines = yLabels.map((label: [number, string]) => (
			<line
				key={label[1]}
				x1={0}
				y1={yToPx(label[0])}
				x2={WIDTH}
				y2={yToPx(label[0])}
				className='graph-line'
			/>
		))
		
		// Remove first and last lines. Only for aestetic reasons.
		yLines.shift()
		xLines.shift()
		yLines.pop()
		xLines.pop()

		return xLines.concat(yLines)
	}

	// This sucked to code...
	const getPath = (): string => {
		if(boundX === undefined || boundY === undefined) return ''

		let pathString = `M${0} ${HEIGHT}`

		for(let i = 1; i < dataPoints.length; i++){
			let beforePrevPos = dataPoints[i-2]
			let prevPos = dataPoints[i-1]
			const currentPos = dataPoints[i]
			let nextPos = dataPoints[i+1]
			
			// If these positions don't exist, just set them to the current point.
			if(beforePrevPos == undefined) beforePrevPos = currentPos
			if(prevPos == undefined) prevPos = currentPos
			if(nextPos == undefined) nextPos = currentPos

			// Get the control points for the cubic bezier.
			const cOne = getControlPoint(beforePrevPos,prevPos,currentPos, true)
			const cTwo = getControlPoint(prevPos,currentPos,nextPos, false)

			// Map values from input data coordinate space to pixel coordinate space.
			const lastPixelPos = coordToPx(prevPos)
			const pixelPos = coordToPx(currentPos)
			const cOnePixel = coordToPx(cOne)
			const cTwoPixel = coordToPx(cTwo)

			// Append current section to path.
			// Line break in string literal kinda messes up the string but still works so.
			pathString+= `M${lastPixelPos.x},${lastPixelPos.y} C${cOnePixel.x} ${cOnePixel.y} 
						  ${cTwoPixel.x} ${cTwoPixel.y}, ${pixelPos.x} ${pixelPos.y} `
		}
		return pathString

		/**
		 * Gets the length between two points using the pythagorean theorem.
		 * @param p1 First point
		 * @param p2 Second point
		 * @returns the length between the points.
		 */
		function getLength(p1: Point, p2: Point) {
			return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
		}
		/**
		 * Two points define a linear curve.
		 * Returns the angle at which this curve is from the x-axis.
		 * @param p1 First point
		 * @param p2 Second point
		 * @returns Angle from the x-axis, in radians.
		 */
		function getAngle(p1: Point, p2: Point){
			return Math.atan2(p2.y - p1.y, p2.x - p1.x)
		}
		/**
		 * Gets the point where control point should be placed.
		 * @param previous Previous point.
		 * @param current Current point.
		 * @param next Next point.
		 * @param forward Which side of the current point the control point should be placed
		 * 				  on the x-axis.
		 * @returns The appropriate position for a control point.
		 */
		function getControlPoint(previous: Point, current: Point, next: Point, forward: boolean){
			let length = getLength(previous, next)
			let angle = getAngle(previous, next)

			// Controls how far from the current point the control point
			// should be placed on the x-axis.
			const smoothing = 0.2
			length = length * smoothing

			// Adding pi reflects the point around the current point since pi rad == 180 deg.
			angle = angle + (forward ? 0 : Math.PI)

			return {
				x: current.x + Math.cos(angle) * length,
				y: current.y + Math.sin(angle) * length
			}
		}
	}
	const coordToPx = (p: Point): Point => {
		return new Point(xToPx(p.x), yToPx(p.y))
	}
	const xToPx = (x: number): number => {
		if(boundX === undefined) throw new Error('xToPx was called before boundX was defined.')
		// Convert coordinate step to pixels.
		const dx = WIDTH / Math.abs(boundX[0] - boundX[1])
		// Offset beginning of graph to 0 when coordinates are negative
		const nOffsetX = Math.abs(boundX[0])*dx
		// This calculation is wrong, at least for Y. Negative points go outside.
		return x * dx + nOffsetX
	}
	const yToPx = (y: number): number => {
		if(boundY === undefined) throw new Error('yToPx was called before boundY was defined.')
		// Convert coordinate step to pixels.
		const dy = HEIGHT / Math.abs(boundY[0] - boundY[1])
		// Offset beginning of graph to 0 when coordinates are negative.
		const nOffsetY = boundY[0]*dy
		// This calculation is wrong, at least for Y. Negative points go outside.
		return HEIGHT - (y * dy) + nOffsetY
	}

	return (
		<div className='graph-container' style={{width: WIDTH + 'px', height: HEIGHT + 'px'}}>
			{drawGraph()}
		</div>
	)
}