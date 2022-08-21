import { useState, useEffect } from 'react'

/**
 * 
 * @param url - the url to fetch data from
 * @returns 
 * - data - the data returned from the fetch. already parsed to JSON.
 * - loading - boolean indicating if the fetch is in progress
 * - error - the error returned from the fetch
 */
export default function useFetch(url: string): [unknown, boolean, unknown] {
	const [data, setData] = useState<unknown>()
	const [error, setError] = useState<Error | null>(null)
	const [loading, setLoading] = useState<boolean>(true)

	useEffect(() => {
		setLoading(true)
		fetch(url)
			.then(res => res.text())
			.then(text => JSON.parse(text))
			.then(data => setData(data))
			.catch(err => setError(err))
	}, [url])

	useEffect(() => {
		if (error || data)
			setLoading(false)
	}, [data, error])

	return [data, loading, error]
}