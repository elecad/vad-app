import { PrimeIcons } from 'primereact/api'
import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Checkbox } from 'primereact/checkbox'
import { Slider } from 'primereact/slider'
import { classNames } from 'primereact/utils'
import { useEffect, useRef, useState } from 'react'
import bufferToWave from '../helpers/ArrayBufferToWav.js'
import useWorker from '../hooks/useWorker.tsx'
import FileLoader from './FileLoader.tsx'

const color_L = '#7cf'
const color_R = '#f7c'

export interface CustomFile extends File {
	objectURL: string
}

function CutPauses() {
	const [stage, setStage] = useState(0)
	const [audio, setAudio] = useState<null | CustomFile>(null)
	const [N, setN] = useState(500)
	const [K, setK] = useState(3)
	const [audioSource, setAudioSource] = useState<null | AudioBuffer>(null)

	const canvasElement = useRef<HTMLCanvasElement>(null)
	const { searchPauses, pauses, loading } = useWorker()
	const [playInterval, setPlayInterval] = useState(0)
	const [audioLinePosition, setAudioLinePosition] = useState(0)
	const [playWithOutPause, setPlayWitchOutPause] = useState(true)
	const audioElement = useRef<HTMLAudioElement>(null)
	const [сompression, setCompression] = useState(0)
	const [fileLink, setFileLink] = useState('')
	const [patternLink, setPatternLink] = useState('')

	useEffect(() => {
		if (stage == 1) {
			decodeAudio() // закидывает измерения аудио в audioSource
		}
	}, [stage])

	useEffect(() => {
		if (stage == 1) {
			console.log(audioSource)

			searchPauses(audioSource as AudioBuffer, N, K)
		}
	}, [audioSource, N, K])

	useEffect(() => {
		renderCanvas() // перерисовывает график
		setAudioDownloadLink()
		setPatternDownloadLink()
	}, [pauses])

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

	const renderCanvas = () => {
		if (!audioSource) return
		if (!canvasElement.current) return

		const data = audioSource.getChannelData(0)
		const ctx = canvasElement.current.getContext('2d')

		for (var i = 0; i < data.length; i++) {
			var x = Math.floor((i / data.length) * canvasElement.current.width)
			var L = (data[i] * canvasElement.current.height) / 2
			const pausesIndex = Math.floor(i / N)
			if (ctx) {
				ctx.fillStyle = pauses[pausesIndex] ? color_R : color_L
				ctx.fillRect(x, canvasElement.current.height * 0.5, 1, -L)
			}
		}
	}

	const setAudioDownloadLink = () => {
		if (!audioSource) return
		const data = audioSource?.getChannelData(0)
		const newAudioBuffer: number[] = []
		for (let i = 0; i < data.length; i++) {
			const pausesIndex = Math.floor(i / N)
			if (!pauses[pausesIndex]) {
				newAudioBuffer.push(data[i])
			}
		}

		const context = new AudioContext()
		const fileReader = new FileReader()
		fileReader.addEventListener('load', async f => {
			const arrayBuffer = f.target?.result as ArrayBuffer
			const s = await context.decodeAudioData(arrayBuffer)
			s.getChannelData(0).set(newAudioBuffer)
			setCompression(1 - newAudioBuffer.length / data.length)

			const url = URL.createObjectURL(bufferToWave(s, newAudioBuffer.length))
			setFileLink(url)
		})
		fileReader.readAsArrayBuffer(audio as Blob)
	}

	const setPatternDownloadLink = () => {
		const type = 'text/plain'
		const pattern = {
			pauses,
			N,
			K,
			сompression,
		}
		const href = URL.createObjectURL(
			new Blob([JSON.stringify(pattern)], { type })
		)
		setPatternLink(href)
	}

	const playHandler = () => {
		const id = setInterval(() => {
			if (!audioSource) return
			if (!audioElement.current) return
			const { currentTime, duration } = audioElement.current
			const { width } = canvasElement.current as HTMLCanvasElement
			const position = Math.floor((currentTime / duration) * width)
			const sample = currentTime * audioSource?.sampleRate
			const pausesIndex = Math.floor(sample / N)
			if (playWithOutPause && pauses[pausesIndex]) {
				// Если пауза
				const newVoicePosition = pauses.indexOf(0, pausesIndex)
				const newTime = (newVoicePosition * N) / audioSource.sampleRate
				audioElement.current.currentTime = newTime
			}
			setAudioLinePosition(position)
		}, 5)
		setPlayInterval(id)
	}
	const pauseHandler = () => {
		clearInterval(playInterval)
	}

	const onChangeCheckBoxHandler = () => {
		audioElement.current?.pause()
		setPlayWitchOutPause(!playWithOutPause)
	}

	return (
		<div className={'cut-pauses-file-loader'}>
			{stage == 0 && (
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
							setStage(1)
						}}
					/>
				</div>
			)}
			{stage == 1 && (
				<div
					className={classNames('flex', 'flex-column', 'align-items-center')}
				>
					<h1>Voice Activity Detection</h1>
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
								<b>Длительность: </b>
								{audioSource?.duration} сек.
							</div>
							<div>
								<b>Коэффициент сжатия: </b>
								{сompression.toFixed(4)}
							</div>
						</div>

						<div className="grid">
							<div className="col">
								<div className={classNames('mb-2')}>Размер окна</div>
								<Slider
									value={N}
									step={50}
									min={10}
									max={1500}
									onChange={e => setN(e.value as number)}
								/>
								<div className={'mt-2'}>{N}</div>
							</div>
							<div className="col">
								<div className={classNames('mb-2')}>Коэффициент k</div>
								<Slider
									value={K}
									step={1}
									min={1}
									max={15}
									onChange={e => setK(e.value as number)}
								/>
								<div className={'mt-2'}>{K}</div>
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
								src={audio?.objectURL}
								style={{ borderRadius: '25px' }}
								onPlay={playHandler}
								onPause={pauseHandler}
								ref={audioElement}
							></audio>
							<div className={classNames('check-box-wrapper')}>
								<Checkbox
									checked={playWithOutPause}
									onChange={onChangeCheckBoxHandler}
								/>
								<label className={classNames('ml-2')}>Проиграть без пауз</label>
							</div>
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
									label={'Сохранить аудио-файл'}
									iconPos={'left'}
									className="p-button-primary"
									size="small"
									style={{ marginTop: '15px' }}
									disabled={!fileLink || loading}
								/>
							</a>
							<a
								className={classNames({ 'pointer-none': loading })}
								download
								href={patternLink}
							>
								<Button
									type="button"
									icon={PrimeIcons.PAUSE}
									label={'Сохранить паттерн пауз'}
									iconPos={'left'}
									size="small"
									className="p-button-primary"
									style={{ marginTop: '15px' }}
									disabled={!patternLink || loading}
								/>
							</a>
						</div>
					</Card>
				</div>
			)}
		</div>
	)
}

export default CutPauses
