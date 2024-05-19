import { Button } from 'primereact/button'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import { classNames } from 'primereact/utils'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { routes, routesUrl } from './router'

function App() {
	const location = useLocation()

	const isActive = (url: string) => {
		return url !== location.pathname
	}
	return (
		<div
			className={classNames(
				'app',
				'w-screen',
				'h-screen',
				'surface-100',
				'flex',
				'align-items-center',
				'justify-content-center',
				'flex-column',
				'gap-3'
			)}
		>
			<div className={classNames('nav-links', 'flex gap-3')}>
				<Link to={'cut'}>
					<Button
						label="Очистка от пауз"
						size={'small'}
						link={isActive(routesUrl.cutPage)}
					/>
				</Link>
				<Link to={'restore'}>
					<Button
						label="Восстановление пауз"
						size={'small'}
						link={isActive(routesUrl.restorePage)}
					/>
				</Link>
				<Link to={'help'}>
					<Button
						label="Помощь"
						size={'small'}
						link={isActive(routesUrl.helpPage)}
					/>
				</Link>
			</div>
			<div className={classNames('content')}>
				<Routes>
					{routes.map(({ path, element }) => (
						<Route path={path} element={element} key={path}></Route>
					))}
				</Routes>
			</div>
		</div>
	)
}

export default App
