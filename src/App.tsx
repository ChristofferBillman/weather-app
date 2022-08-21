import './styles/App.css'
import './styles/Type.css'

import DataPoint from './components/DataPoint'

import Thermostat from './icons/thermostat.svg'
import Humidity from './icons/humidity.svg'
import Waterdrop from './icons/waterdrop.svg'
import Wind from './icons/wind.svg'

const DataPointProps = [
	{
		data: '20',
		label: 'Temperature',
		icon: Thermostat,
	},
	{
		data: '0',
		label: 'Humidity',
		icon: Humidity,
	}, {
		data: '0',
		label: 'Preciptation',
		icon: Waterdrop,
	},
	{
		data: '0',
		label: 'Wind',
		icon: Wind,
	}
]

export default function App() {
	return (
		<div className='App'>
			<div className='app-container'>
				<div className='overview-container'>
					<h1>Overview</h1>
					<div className='datapoints-container'>
						{DataPointProps.map((props, index) => <DataPoint key={index} {...props} />)}
					</div>
				</div>
				<div className='detail-container'>
					<h1>Detail</h1>
				</div>
			</div>
		</div>
	)
}
