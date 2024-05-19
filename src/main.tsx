import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import { PrimeReactProvider } from 'primereact/api'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<PrimeReactProvider>
			<HashRouter>
				<App />
			</HashRouter>
		</PrimeReactProvider>
	</React.StrictMode>
)
