import Size from '../types/Size'

interface HSpaceProps {
	width: Size
}

export default function HSpace({width}: HSpaceProps) {	
	return <div style={{width: width}}/>
}