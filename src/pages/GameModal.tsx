import { zodResolver } from '@hookform/resolvers/zod'
import { format, fromUnixTime } from 'date-fns'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { gamesApi } from '~/api/service/games'
import { useAppSelector } from '~/redux/hooks'
import { GameStatus, getAllGameStatus } from '~/types/enum'
import { GameItems } from '~/types/game.type'
import { existByName } from '~/utils/game.util'
import { NAME_REGEX } from '~/utils/regexChecker'
import { convertDateToTimestamp } from '~/utils/time.util'
interface GameModalProps {
  isEditGame: boolean
  data?: GameItems
  setReloadPage: React.Dispatch<React.SetStateAction<boolean>>
  handleCloseModal: () => void
}

const formSchema = z.object({
  name: z.string().trim().regex(NAME_REGEX, 'Please enter name of game!!!'),
  releaseDate: z.string(),
  status: z.string()
})

function GameModal({
  isEditGame,
  data,
  setReloadPage,
  handleCloseModal
}: Readonly<GameModalProps>) {
  const listOfGames = useAppSelector(state => state.gameReducer.games)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name,
      releaseDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      status: data?.status ?? GameStatus.ACTIVE
    }
  })

  const getDateTimeValue = (timestamp: number | undefined): string => {
    if (timestamp === undefined) {
      return format(new Date(), "yyyy-MM-dd'T'HH:mm")
    }
    return format(fromUnixTime(timestamp), "yyyy-MM-dd'T'HH:mm")
  }
  const [releaseDate, setReleaseDate] = useState<string>(getDateTimeValue(data?.releaseDate))

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const newTimestamp = convertDateToTimestamp(releaseDate as string)
    const requestField = {
      ...values,
      name: values.name.trim(),
      releaseDate: newTimestamp
    }

    const isExistName = existByName(listOfGames, requestField.name)

    if (data?.id) {
      if (isExistName && data.name !== requestField.name) {
        toast.error('Game name already exists')
        return
      }
    } else {
      if (isExistName) {
        toast.error('Game name already exists')
        return
      }
    }

    const apiCall = data?.id
      ? () => gamesApi.updateGame(data.id as string, requestField)
      : () => gamesApi.createGame(requestField)

    const success = await handleApiResponse(
      apiCall,
      data?.id ? 'Game updated successfully' : 'Game created successfully',
      data?.id ? 'Error while updating game' : 'Error while creating game'
    )

    if (success) {
      setReloadPage(true)
      handleCloseModal()
    }
  }

  const handleApiResponse = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apiCall: () => Promise<any>,
    successMessage: string,
    errorMessage: string
  ) => {
    try {
      const response = await apiCall()
      if (response.status === 200 || response.status === 201) {
        toast.success(successMessage)
        return true
      } else {
        toast.error(errorMessage)
        return false
      }
    } catch (error) {
      toast.error('Error: ' + error)
      return false
    }
  }

  const displayTitleOfModal = () => {
    if (data?.id) {
      if (isEditGame) return 'Edit Game'
      else return 'View Game'
    } else {
      return 'Create New Game'
    }
  }

  const handleReleaseDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReleaseDate(e.target.value)
  }

  return (
    <div className='w3-modal' style={{ display: 'block' }}>
      <div className='w3-modal-content w3-animate-top w3-card-4'>
        <header className='w3-container w3-teal'>
          <span onClick={handleCloseModal} className='w3-button w3-display-topright'>
            &times;
          </span>
          <h2>{displayTitleOfModal()}</h2>
        </header>
        <div className='w3-card-4'>
          <form className='w3-container form_custom' onSubmit={handleSubmit(onSubmit)}>
            <label className='w3-text-blue'>
              <b>Name</b>
            </label>
            <input
              className='w3-input w3-border'
              type='text'
              disabled={!isEditGame}
              {...register('name', { required: true })}
            ></input>
            {errors.name && <p>{errors.name.message}</p>}
            <label className='w3-text-blue'>
              <b>Release Date</b>
            </label>
            <input
              type='datetime-local'
              id='releaseDate'
              value={releaseDate}
              disabled={!isEditGame}
              {...register('releaseDate')}
              onChange={handleReleaseDateChange}
            ></input>

            <div className='select'>
              <label className='w3-text-blue'>
                <b>Status</b>
              </label>
              <select disabled={!isEditGame} {...register('status')}>
                {getAllGameStatus().map((status, index) => (
                  <option value={status} key={index}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            {isEditGame && <input type='submit' className='btn' />}
          </form>
        </div>
      </div>
    </div>
  )
}

export default GameModal
