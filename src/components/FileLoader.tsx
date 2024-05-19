import { Button } from 'primereact/button'
import {
	FileUpload,
	FileUploadSelectEvent,
	ItemTemplateOptions,
} from 'primereact/fileupload'
import { classNames } from 'primereact/utils'
import { Dispatch, SetStateAction, useRef } from 'react'
import { CustomFile } from './CutPauses'

interface FileLoaderProps {
	headerLabel: string
	emptyLabel: string
	file: CustomFile | null
	setFile: Dispatch<SetStateAction<CustomFile | null>>
	type?: 'audio/wav' | 'text/plain'
	accept?: 'audio/wav' | '.txt'
}

function FileLoader({
	emptyLabel,
	setFile,
	headerLabel,
	type = 'audio/wav',
	accept = 'audio/wav',
}: FileLoaderProps) {
	const fileInputElement = useRef<null | FileUpload>(null)

	const selectHandler = ({ files }: FileUploadSelectEvent) => {
		const file = files[0] as CustomFile
		console.log(file.type, type)

		if (file.type == type) {
			setFile(file)
		}
	}

	const removeHandler = () => {
		fileInputElement.current?.clear()
		setFile(null)
	}

	const emptyTemplate = () => (
		<div
			className={classNames(
				'flex',
				'align-items-center',
				'justify-content-center',
				'flex-column',
				'gap-3'
			)}
		>
			<i className="pi pi-arrow-circle-down" style={{ fontSize: '2.5rem' }}></i>
			<p className="m-0">{emptyLabel}</p>
		</div>
	)
	const itemTemplate = (currentFile: object, props: ItemTemplateOptions) => {
		const { formatSize } = props
		const current = currentFile as File
		return (
			<div
				style={{
					width: '100%',
					height: '80px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
					<i
						className={classNames('pi', {
							'pi-microphone': type == 'audio/wav',
							'pi-file': type == 'text/plain',
						})}
						style={{ fontSize: '1.7rem' }}
					></i>
					<div>{current.name}</div>
				</div>
				<div style={{ fontSize: '0.75rem' }}>{formatSize}</div>
				<Button
					type="button"
					icon="pi pi-times"
					className="p-button p-button-danger"
					onClick={removeHandler}
				/>
			</div>
		)
	}
	return (
		<div
			className={classNames(
				'stage-0',
				'flex',
				'flex-column',
				'justify-content-center',
				'align-items-center'
			)}
		>
			<h1>{headerLabel}</h1>
			<FileUpload
				ref={fileInputElement}
				accept={accept}
				className={'cut-file-loader'}
				mode={'advanced'}
				auto
				chooseLabel={'Выбор файла'}
				itemTemplate={itemTemplate}
				emptyTemplate={emptyTemplate}
				onSelect={selectHandler}
			/>
		</div>
	)
}

export default FileLoader
