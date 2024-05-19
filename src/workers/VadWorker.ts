interface VadDeviceEvent
	extends MessageEvent<{ audioSamples: number[]; N: number; K: number }> {}

self.addEventListener('message', (e: VadDeviceEvent) => {
	const { audioSamples, K, N } = e.data
	const data = audioSamples
	console.log('[W] Старт подсчёта')

	let c = Math.floor(data.length / N)
	const pausesMask = new Array(c).fill(0)
	const P = new Array(c).fill(0)
	let p_mid = 0
	let p_count = 0
	let H = 99999999
	for (let i = 0; i < c; i++) {
		for (let j = 0; j < N; j++) {
			const t = (i - 1) * N + j
			P[i] = P[i] + data[t] * data[t]
		}
		if (P[i] < H) {
			p_mid = p_mid + P[i]
			p_count = p_count + 1
			H = K * (p_mid / p_count)
			pausesMask[i] = 1
		}
	}
	console.log('[W] Конец подсчёта')

	postMessage({ pausesMask })
})
