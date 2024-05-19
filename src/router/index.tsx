import { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import CutPauses from '../components/CutPauses.tsx'
import HelpPage from '../components/HelpPage.tsx'
import RestorePauses from '../components/RestorePauses.tsx'

interface IRoutes {
	path: string
	element: ReactElement
}

export const routesUrl = {
	mainPage: '/',
	cutPage: '/cut',
	restorePage: '/restore',
	helpPage: '/help',
}

export const routes: IRoutes[] = [
	{
		path: routesUrl.mainPage,
		element: <Navigate to={routesUrl.cutPage} />,
	},
	{
		path: routesUrl.cutPage,
		element: <CutPauses />,
	},
	{
		path: routesUrl.restorePage,
		element: <RestorePauses />,
	},
	{
		path: routesUrl.helpPage,
		element: <HelpPage />,
	},
]
