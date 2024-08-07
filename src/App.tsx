import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import TableOfGames from './pages/TableOfGames'

function App() {
  return (
    <>
      <TableOfGames />
      <ToastContainer newestOnTop className='toast-position' position='top-center' />
    </>
  )
}

export default App
