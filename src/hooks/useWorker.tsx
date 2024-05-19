import { useState } from 'react'

const PATH = '../workers/VadWorker.ts'
const DELAY = 400

interface VadClientEvent extends MessageEvent<{ pausesMask: number[] }> {}
const worker = new Worker(new URL(PATH, import.meta.url))
export default function useWorker() {
	const [pauses, setPauses] = useState<number[]>([])
	const [loading, setLoading] = useState(true)
	const [timerId, setTimerId] = useState(0)

	worker.addEventListener('message', (e: VadClientEvent) => {
		const { pausesMask } = e.data
		setPauses(pausesMask)
		setLoading(false)
	})

	const searchPauses = (audioSource: AudioBuffer, N: number, K: number) => {
		setLoading(true)
		if (timerId) {
			console.log('[!] Отмена подсчёта...')
			clearTimeout(timerId)
		}
		const id = setTimeout(() => {
			const audioSamples = audioSource.getChannelData(0)
			worker.postMessage({
				audioSamples,
				N,
				K,
			})
		}, DELAY)
		setTimerId(id)
	}

	return { pauses, searchPauses, loading }
}
