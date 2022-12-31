import Size from '../types/Size'

interface VSpaceProps {
	height: Size
}

export default function VSpace({height}: VSpaceProps) {	
	return <div style={{height: height}}/>
}