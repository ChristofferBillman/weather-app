import './styles/App.css'
import './styles/Type.css'

import DataPoint from './components/DataPoint'

import Thermostat from './icons/thermostat.svg'

export default function App() {
	return (
		<div className='App'>
			<div className='app-container'>
				<div className='overview-container'>
					<h1>Overview</h1>
					<div className='datapoints-container'>
						<DataPoint label='Temperature' data='24' icon={Thermostat} onClick={() => console.log('hello')} />
						<DataPoint label='Temperature' data='24' icon={Thermostat} onClick={() => console.log('hello')} />
						<DataPoint label='Temperature' data='24' icon={Thermostat} onClick={() => console.log('hello')} />
						<DataPoint label='Temperature' data='24' icon={Thermostat} onClick={() => console.log('hello')} />
					</div>
				</div>
				<div className='detail-container'>
					<h1>Detail</h1>
				</div>
			</div>
		</div>
	)
}
