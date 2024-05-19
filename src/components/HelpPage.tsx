import { Button } from 'primereact/button'
import { Card } from 'primereact/card'
import { Stepper } from 'primereact/stepper'
import { StepperPanel } from 'primereact/stepperpanel'
import { classNames } from 'primereact/utils'
import { useRef } from 'react'

function HelpPage() {
	const stepperRef = useRef(null)

	return (
		<div className={classNames('flex', 'flex-column', 'align-items-center')}>
			<h1>Voice Activity Detection</h1>
			<Card className={classNames('fix-card')}>
				<Stepper ref={stepperRef}>
					<StepperPanel header="Очистка от пауз">
						<div className="flex flex-column">
							<div className="border-2 border-dashed surface-border border-round font-medium text-justify p-2">
								<div>
									Для работы программы нужен звуковой файл в формате Waveform
									Audio File Format (WAV). К файлу предъявляются следующие
									требования:
								</div>
								<ul>
									<li>Частота дискретизации: 8000 Гц</li>
									<li>Количество каналов: 1 (моно)</li>
								</ul>
								<div className={classNames('text-center my-3 text-lg')}>
									<b>
										С отличными от требований файлами программа может работать
										некорректно!
									</b>
								</div>
								<div className={classNames('my-1')}>
									Сначала программа предлагает выбрать аудио-файл. Можно
									воспользоваться Drag and Drop и перетащить выбранный
									аудио-файл. При необходимости можно воспользоваться
									Проводником.Выбор файла можно отменить с помощью
									соответствующей кнопки.
								</div>
								<div className={classNames('my-1')}>
									После выбора файла произойдёт переход к основному окну работы
									программы. Окно состоит из поля с характеристиками,
									осциллограмма звука с выделением речи/паузы и кнопок действий.
								</div>
								<div className={classNames('my-1')}>
									Параметры алгоритма:
									<ul>
										<li>
											<b>Размер окна</b> - размер участков, но которые будет
											разбит аудио-файл
										</li>
										<li>
											<b>Коэффициент k </b>- параметр "агрессивности" алгоритма
										</li>
									</ul>
								</div>
								<div className={classNames('my-1')}>
									После подбора необходимых параметров результат можно
									прослушать как с паузами, так и без. За этот функционал
									отвечает флажок "Проиграть без пауз". После настройки
									алгоритма можно скачать очищенный аудио-файл и паттерн пауз
									для него.
								</div>
							</div>
						</div>
						<div className="flex pt-4 justify-content-end">
							<Button
								label="Вперёд"
								icon="pi pi-arrow-right"
								iconPos="right"
								// @ts-ignore
								onClick={() => stepperRef.current.nextCallback()}
							/>
						</div>
					</StepperPanel>
					<StepperPanel header="Восстановление пауз">
						<div className="flex flex-column">
							<div className="border-2 border-dashed surface-border border-round font-medium text-justify p-2">
								<div>
									Для восстановления пауз программе нужен звуковой файл в
									формате Waveform Audio File Format (WAV) и Паттерн пауз для
									него. К аудио-файлу предъявляются такие же требования.
								</div>

								<div className={classNames('text-center my-3 text-lg')}>
									<b>
										С отличными от требований файлами программа может работать
										некорректно!
									</b>
								</div>
								<div className={classNames('my-1')}>
									Сначала программа предлагает выбрать Паттерн пауз. Можно
									воспользоваться Drag and Drop и перетащить выбранный файл.
									Паттерн пауз представляет собой текстовый файл txt с
									необходимыми для восстановления пауз данными.
								</div>
								<div className={classNames('my-1')}>
									Следующим этапом программа предлагает выбрать аудио-файл без
									пауз. После выбора будет выполнен переход к главному окну
									восстановления пауз.
								</div>
								<div className={classNames('my-1')}>
									Параметры восстановления:
									<ul>
										<li>
											<b>Уровень шума</b> - указывает, насколько громким будет
											фоновый шум в местах пауз.
										</li>
										<li>
											<b>Множитель частоты дискретизации </b> - параметр тона
											звука, попробуйте :)
										</li>
									</ul>
								</div>
								<div className={classNames('my-1')}>
									После подбора необходимых параметров результат можно
									прослушать. Результат последствии можно сохранить на
									компьютер.
								</div>
							</div>
						</div>
						<div className="flex pt-4 justify-content-between">
							<Button
								label="Назад"
								severity="secondary"
								icon="pi pi-arrow-left"
								// @ts-ignore
								onClick={() => stepperRef.current.prevCallback()}
							/>
							<Button
								label="Вперёд"
								icon="pi pi-arrow-right"
								iconPos="right"
								// @ts-ignore
								onClick={() => stepperRef.current.nextCallback()}
							/>
						</div>
					</StepperPanel>
					<StepperPanel header="Особенности">
						<div className="flex flex-column h-12rem">
							<div className="border-2 border-dashed surface-border border-round flex-auto flex justify-content-center align-items-center font-medium flex-column">
								<b className="mb-3">Особенности программы</b>
								<div>Динамическое изменение результата </div>
								<div>Вычисление алгоритма VAD в отдельном потоке</div>
								<div>Анимация процесса вычисления</div>
								<div>Воспроизведение результата в реальном времени </div>

								<b className="mt-3">Anton Dakhin 2024</b>
							</div>
						</div>
						<div className="flex pt-4 justify-content-start">
							<Button
								label="Назад"
								severity="secondary"
								icon="pi pi-arrow-left"
								// @ts-ignore
								onClick={() => stepperRef.current.prevCallback()}
							/>
						</div>
					</StepperPanel>
				</Stepper>
			</Card>
		</div>
	)
}

export default HelpPage
