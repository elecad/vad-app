import { PrimeIcons } from 'primereact/api'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Slider } from 'primereact/slider'
import { Toast } from 'primereact/toast'
import { classNames } from 'primereact/utils'
import { useEffect, useRef, useState } from 'react'
import bufferToWave from '../helpers/ArrayBufferToWav'
import { CustomFile } from './CutPauses'
import FileLoader from './FileLoader'

interface Pattern {
	pauses: number[]
	K: number
	N: number
	сompression: number
}

const color_L = '#7cf'
const color_R = '#f7c'

function RestorePauses() {
	const [stage, setStage] = useState(0)
	const [audio, setAudio] = useState<null | CustomFile>(null)
	const [pattern, setPattern] = useState<null | CustomFile>(null)
	const canvasElement = useRef<HTMLCanvasElement>(null)
	const [audioLinePosition, setAudioLinePosition] = useState(0)
	const [N, setN] = useState(500)
	const [K, setK] = useState(3)
	const [сompression, setCompression] = useState(0)

	const [pauses, setPauses] = useState<number[]>([])
	const [audioSource, setAudioSource] = useState<null | AudioBuffer>(null)
	const toastElement = useRef<Toast>(null)

	const [noiseLevel, setNoiseLevel] = useState(3)
	const [newAudioData, setNewAudioData] = useState<number[]>([])

	const [fileLink, setFileLink] = useState('')
	const [loading, setLoading] = useState(true)

	const [playInterval, setPlayInterval] = useState(0)
	const [timerId, setTimerId] = useState(0)
	const audioElement = useRef<HTMLAudioElement>(null)
	const [sampleRateUp, setSampleRateUp] = useState(0)

	useEffect(() => {
		if (stage == 2) {
			console.log('[!] Чтение паттерна')

			readPatternFile()
		}
	}, [stage])

	useEffect(() => {
		if (stage == 2) {
			console.log('[!] Декодирование аудио')
			decodeAudio()
		}
	}, [pauses])

	useEffect(() => {
		console.log('[!] Рендер графика')
		renderCanvas()
	}, [newAudioData])

	useEffect(() => {
		if (newAudioData && audio) {
			playPauseAudio()
		}
	}, [newAudioData])

	useEffect(() => {
		setLoading(true)
		if (timerId) {
			console.log('[!] Отмена подсчёта...')
			clearTimeout(timerId)
		}
		const id = setTimeout(() => {
			restoreAudio()
			setLoading(false)
		}, 400)
		setTimerId(id)
	}, [audioSource, noiseLevel, sampleRateUp])

	const playPauseAudio = () => {
		if (!audioSource) return
		const fileReader = new FileReader()
		fileReader.addEventListener('load', async () => {
			const sampleRateUpValue = !sampleRateUp ? 1 : sampleRateUp
			const audioBuffer = new AudioBuffer({
				length: newAudioData.length,
				// sampleRate: audioSource?.sampleRate * 2,
				sampleRate: audioSource?.sampleRate * sampleRateUpValue,
			})

			audioBuffer.getChannelData(0).set(newAudioData)

			const url = URL.createObjectURL(
				bufferToWave(audioBuffer, newAudioData.length)
			)

			setFileLink(url)
		})
		console.log(audio)

		fileReader.readAsArrayBuffer(audio as Blob)
	}

	const readPatternFile = async () => {
		if (!pattern) return
		const text = await pattern.text()
		try {
			const patternJson = JSON.parse(text) as Pattern
			setN(patternJson.N)
			setK(patternJson.K)
			setCompression(patternJson.сompression)
			setPauses(patternJson.pauses)
		} catch {
			console.log('[!] Ошибка чтения файла с паттерном')
			toastElement.current?.show({
				severity: 'error',
				summary: 'Ошибка',
				detail: 'Некорректный паттерн пауз',
			})
			setStage(0)
		}
	}

	const decodeAudio = () => {
		const context = new AudioContext()
		const fileReader = new FileReader()
		fileReader.addEventListener('load', async f => {
			if (f.target) {
				const s = await context.decodeAudioData(f.target.result as ArrayBuffer)
				setAudioSource(s)
			}
		})
		fileReader.readAsArrayBuffer(audio as File)
	}

	const restoreAudio = () => {
		if (!audioSource) return
		console.log('[!] Восстановление сигнала')
		const data = audioSource.getChannelData(0)
		const newAudioBuffer: number[] = []

		let dataIndex = 1

		for (let i = 1; i <= pauses.length; i++) {
			if (pauses[i] == 0) {
				for (let j = (dataIndex - 1) * N; j < dataIndex * N; j++) {
					newAudioBuffer.push(data[j])
				}
				dataIndex = dataIndex + 1
			} else {
				for (let j = (i - 1) * N; j < i * N; j++) {
					newAudioBuffer.push(Math.random() * 0.001 * noiseLevel)
				}
			}
		}

		setNewAudioData(newAudioBuffer)
	}

	const renderCanvas = () => {
		if (!newAudioData) return
		if (!canvasElement.current) return

		const ctx = canvasElement.current.getContext('2d')
		if (ctx) {
			ctx.clearRect(
				0,
				0,
				canvasElement.current.width,
				canvasElement.current.height
			)

			for (var i = 0; i < newAudioData.length; i++) {
				var x = Math.floor(
					(i / newAudioData.length) * canvasElement.current.width
				)
				var L = (newAudioData[i] * canvasElement.current.height) / 2
				const pausesIndex = Math.floor(i / N)

				ctx.fillStyle = pauses[pausesIndex] ? color_R : color_L
				ctx.fillRect(x, canvasElement.current.height * 0.5, 1, -L)
			}
		}
	}

	const playHandler = () => {
		const id = setInterval(() => {
			if (!audioSource) return
			if (!audioElement.current) return
			const { currentTime, duration } = audioElement.current
			const { width } = canvasElement.current as HTMLCanvasElement
			const position = Math.floor((currentTime / duration) * width)

			setAudioLinePosition(position)
		}, 5)
		setPlayInterval(id)
	}
	const pauseHandler = () => {
		clearInterval(playInterval)
	}

	return (
		<div className={classNames('restore-pauses-file-loader')}>
			<Toast ref={toastElement} />
			{stage == 0 && (
				<div
					className={classNames('flex', 'flex-column', 'align-items-center')}
				>
					<FileLoader
						file={pattern}
						emptyLabel={'Перетащите сюда паттерн для VAD-обработки'}
						headerLabel={'Загрузка текстового файла'}
						setFile={setPattern}
						type="text/plain"
						accept=".txt"
					/>
					<Button
						type="button"
						icon="pi pi-angle-right"
						label={'Далее'}
						iconPos={'right'}
						className="p-button-primary"
						style={{ marginTop: '20px' }}
						disabled={!pattern}
						onClick={() => {
							setStage(1)
						}}
					/>
				</div>
			)}
			{stage == 1 && (
				<div
					className={classNames('flex', 'flex-column', 'align-items-center')}
				>
					<FileLoader
						file={audio}
						emptyLabel={'Перетащите сюда файл для VAD-обработки'}
						headerLabel={'Загрузка аудио-файла'}
						setFile={setAudio}
					/>
					<Button
						type="button"
						icon="pi pi-angle-right"
						label={'Далее'}
						iconPos={'right'}
						className="p-button-primary"
						style={{ marginTop: '20px' }}
						disabled={!audio}
						onClick={() => {
							setStage(2)
						}}
					/>
				</div>
			)}
			{stage == 2 && (
				<div
					className={classNames('flex', 'flex-column', 'align-items-center')}
				>
					<h1>Восстановление исходного сигнала</h1>
					<Card className={classNames('fix-card')}>
						<div
							className={classNames(
								'flex',
								'flex-column',
								'align-items-center',
								'gap-1',
								'mb-4'
							)}
						>
							<div>
								<b>Файл: </b>
								{audio?.name}
							</div>
							<div>
								<b>Размер окна: </b>
								{N}
							</div>
							<div>
								<b>Коэффициент k: </b>
								{K}
							</div>
							<div>
								<b>Коэффициент сжатия: </b>
								{сompression.toFixed(4)}
							</div>
						</div>

						<div className="grid">
							<div className="col">
								<div className={classNames('mb-2')}>Уровень шума</div>
								<Slider
									value={noiseLevel}
									step={1}
									min={1}
									max={20}
									onChange={e => setNoiseLevel(e.value as number)}
								/>
								<div className={'mt-2'}>{noiseLevel}</div>
							</div>
							<div className="col">
								<div className={classNames('mb-2')}>
									Множитель частоты дискретизации
								</div>
								<Slider
									value={sampleRateUp}
									step={0.1}
									min={0}
									max={3}
									onChange={e => setSampleRateUp(e.value as number)}
								/>
								<div className={'mt-2'}>
									{sampleRateUp ? sampleRateUp : 'Не менять'}
								</div>
							</div>
						</div>

						<div className={'legend'}>
							<div>
								<div className={'example-voice example'}></div>
								<div>Звук</div>
							</div>
							<div>
								<div className={'example-pause example'}></div>
								<div>Пауза</div>
							</div>
						</div>

						<div className={classNames('audio-demo-wrapper')}>
							<div
								className="progress"
								style={{ left: audioLinePosition }}
							></div>
							<canvas
								ref={canvasElement}
								// className={classNames('graph-audio')}
								className={classNames('graph-audio', { loading })}
								width={760}
								height={200}
							></canvas>
						</div>
						<div className={classNames('audio-wrapper')}>
							<audio
								controls
								id="audio"
								className={'mt-2 shadow-3'}
								src={fileLink}
								style={{ borderRadius: '25px' }}
								onPlay={playHandler}
								onPause={pauseHandler}
								ref={audioElement}
							></audio>
						</div>

						<div
							className={classNames(
								'buttons-wrapper',
								'flex',
								'gap-2',
								'align-items-center',
								'justify-content-center'
							)}
						>
							<a
								className={classNames({ 'pointer-none': loading })}
								download
								href={fileLink}
							>
								<Button
									type="button"
									icon={PrimeIcons.DOWNLOAD}
									label={'Сохранить восстановленный аудио-файл'}
									iconPos={'left'}
									className="p-button-primary"
									size="small"
									style={{ marginTop: '15px' }}
									disabled={!fileLink || loading}
								/>
							</a>
						</div>
					</Card>
				</div>
			)}
		</div>
	)
}

export default RestorePauses
