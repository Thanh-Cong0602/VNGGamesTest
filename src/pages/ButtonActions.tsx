import { useState } from 'react'
import { GameItems } from '~/types/game.type'
import DeleteGameModal from './DeleteGameModal'
import GameModal from './GameModal'

interface ButtonActionProps {
  data?: GameItems
  setReloadPage: React.Dispatch<React.SetStateAction<boolean>>
}

function ButtonActions({ data, setReloadPage }: Readonly<ButtonActionProps>) {
  const [isModalOpen, setModalOpen] = useState<boolean>(false)
  const [isModalDelete, setModalDelete] = useState<boolean>(false)
  const [isEditGame, setIsEditGame] = useState<boolean>(false)
  const handleCloseModal = () => {
    setIsEditGame(false)
    setModalOpen(false)
  }
  const handleOpenModal = () => {
    setModalOpen(true)
  }
  const handleCloseModalDelete = () => {
    setModalDelete(false)
  }
  return (
    <>
      <div className='btn_actions'>
        <button className='btn btn_yellow' onClick={() => handleOpenModal()}>
          <i className='fa fa-eye'></i>
        </button>

        <button
          className='btn'
          onClick={() => {
            setIsEditGame(true)
            handleOpenModal()
          }}
        >
          <i className='fa fa-edit'></i>
        </button>

        <button className='btn btn_red' onClick={() => setModalDelete(true)}>
          <i className='fa fa-trash'></i>
        </button>
      </div>
      {isModalOpen && (
        <GameModal
          data={data}
          isEditGame={isEditGame}
          handleCloseModal={handleCloseModal}
          setReloadPage={setReloadPage}
        />
      )}
      {isModalDelete && (
        <DeleteGameModal
          data={data}
          setReloadPage={setReloadPage}
          handleCloseModalDelete={handleCloseModalDelete}
        />
      )}
    </>
  )
}

export default ButtonActions
