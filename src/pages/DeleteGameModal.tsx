import { toast } from 'react-toastify'
import { gamesApi } from '~/api/service/games'
import { errorMessages, successMessages } from '~/common/constants/message.constant'
import { GameItems } from '~/common/types/game.type'

interface DeleteGameModalProps {
  data?: GameItems
  setReloadPage: React.Dispatch<React.SetStateAction<boolean>>
  handleCloseModalDelete: () => void
}

function DeleteGameModal({
  data,
  setReloadPage,
  handleCloseModalDelete
}: Readonly<DeleteGameModalProps>) {
  const handleDelete = async () => {
    try {
      const deleteRes = await gamesApi.deleteGame(data?.id as string)
      if (deleteRes.status === 200) {
        toast.success(successMessages.MSG_S0003)
      } else {
        toast.error(errorMessages.MSG_E0004)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setReloadPage(true)
      handleCloseModalDelete()
    }
  }
  return (
    <div className='w3-modal' style={{ display: 'block' }}>
      <div className='w3-modal-content w3-animate-top w3-card-4'>
        <header className='w3-container w3-teal'>
          <span onClick={handleCloseModalDelete} className='w3-button w3-display-topright'>
            &times;
          </span>
          <h2>Delete game</h2>
        </header>
        <div className='w3-card-4 form_custom delete_container'>
          <p>{`Are you sure delete the game called ${data?.name} ?`} </p>
          <button className='btn_red btn' onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteGameModal
