import { ReactNode } from 'react'
import Size from '../types/Size'

interface HFlexProps {
	justifyContent: string
	alignItems: string
	gap: Size
	children: ReactNode
}

export default function HContainer({alignItems, justifyContent, gap, children}: HFlexProps) {	
	return (
		<div style={{alignItems, justifyContent, gap}}>
			{children}
		</div>
	)
}