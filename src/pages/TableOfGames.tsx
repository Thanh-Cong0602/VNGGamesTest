import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { gamesApi } from '~/api/service/games'
import { setListOfGames } from '~/redux/features'
import { useAppDispatch } from '~/redux/hooks'
import { GameStatus } from '~/types/enum'
import { GameItems } from '~/types/game.type'
import { convertTimestampToDate } from '~/utils/time.util'
import ButtonActions from './ButtonActions'
import GameModal from './GameModal'
import './style.css'

function TableOfGames() {
  const dispatch = useAppDispatch()
  const [games, setGames] = useState<GameItems[]>([])
  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const [reloadPage, setReloadPage] = useState<boolean>(false)

  useEffect(() => {
    fetchData()
    return () => {
      setReloadPage(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadPage])

  const fetchData = async () => {
    try {
      const gamesRes = await gamesApi.getAllGames()
      if (gamesRes.status === 200) {
        const sortArrays = gamesRes.data.sort((n1: GameItems, n2: GameItems) => {
          return parseInt(n2.id as string) - parseInt(n1.id as string)
        })
        setGames(sortArrays)
        dispatch(setListOfGames(gamesRes.data))
      } else {
        toast.error('Error when call API, please contact admin for support.')
      }
    } catch (error) {
      toast.error('Error fetching games:' + error)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }
  const handleOpenModal = () => {
    setModalOpen(true)
  }

  return (
    <>
      <div className='content'>
        <button className='btn btn_green' onClick={() => handleOpenModal()}>
          <i className='fa fa-plus'></i>
          Create
        </button>

        <table className='customers'>
          <tr>
            <th>Name</th>
            <th>Release Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
          {games?.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{convertTimestampToDate(item.releaseDate)}</td>
              <td>
                <div className='status_display'>
                  <p
                    className={`status ${
                      item.status === GameStatus.ACTIVE
                        ? 'btn_green'
                        : item.status === GameStatus.INACTIVE
                        ? 'btn_red'
                        : 'btn_yellow'
                    }`}
                  ></p>
                  <p>{item.status}</p>
                </div>
              </td>
              <td>
                <ButtonActions data={item} setReloadPage={setReloadPage} />
              </td>
            </tr>
          ))}
        </table>
      </div>
      {isModalOpen && (
        <GameModal
          isEditGame={true}
          handleCloseModal={handleCloseModal}
          setReloadPage={setReloadPage}
        />
      )}
    </>
  )
}

export default TableOfGames
