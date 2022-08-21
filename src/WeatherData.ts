export default interface WeatherData {
	current: Info
	daily: Info[]
	default?: unknown
	hourly: Info[]
	lat: number
	lon: number
	minutely: Info[]
	timezone: string
	timezone_offset: number
}
interface Info {
	clouds?: number
	dew_point?: number
	dt?: number
	feels_like?: number | DailyTemp
	humidity?: number
	pressure?: number
	sunrise?: number
	sunset?: number
	moonrise?: number
	moonset?: number
	moon_phase?: number
	pop?: number
	temp?: number | DailyTemp
	rain?: number
	uvi?: number
	visibility?: number
	weather?: WeatherSummary[]
	wind_deg?: number
	wind_speed?: number
}
interface WeatherSummary {
	description: string
	icon: string
	id: number
	main: string
}
interface DailyTemp {
	day?: number
	min?: number
	max?: number
	night?: number
	eve?: number
	morn?: number
}