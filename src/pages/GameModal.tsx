import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { gamesApi } from '~/api/service/games'
import { NAME_REGEX, STANDAR_DATE_TIME_FORMAT } from '~/common/constants/constant'
import {
  errorMessages,
  invalidMessages,
  successMessages
} from '~/common/constants/message.constant'
import { GameItems } from '~/common/types/game.type'
import { GameStatus, getAllGameStatus } from '~/common/types/gameStatus.type'
import { convertDateToTimestamp, existByName, getDateTimeValue } from '~/common/utils/game.util'
import { useAppSelector } from '~/redux/hooks'
interface GameModalProps {
  isEditGame: boolean
  data?: GameItems
  setReloadPage: React.Dispatch<React.SetStateAction<boolean>>
  handleCloseModal: () => void
}

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, invalidMessages.MSG_V0001)
    .regex(NAME_REGEX, invalidMessages.MSG_V0002),
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
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name,
      releaseDate: format(new Date(), STANDAR_DATE_TIME_FORMAT),
      status: data?.status ?? GameStatus.ACTIVE
    }
  })

  const status = watch('status')
  const [isReleaseDateDisabled, setIsReleaseDateDisabled] = useState(false)

  useEffect(() => {
    if (data?.id && status === GameStatus.ACTIVE) {
      setIsReleaseDateDisabled(true)
    } else {
      setIsReleaseDateDisabled(false)
    }
  }, [data?.id, status])

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
        toast.error(errorMessages.MSG_E0001)
        return
      }
      if (data.status === GameStatus.ACTIVE && status === GameStatus.ACTIVE) {
        requestField.releaseDate = data.releaseDate
      }
    } else {
      if (isExistName) {
        toast.error(errorMessages.MSG_E0001)
        return
      }
    }

    const apiCall = data?.id
      ? () => gamesApi.updateGame(data.id as string, requestField)
      : () => gamesApi.createGame(requestField)

    const success = await handleApiResponse(
      apiCall,
      data?.id ? successMessages.MSG_S0002 : successMessages.MSG_S0001,
      data?.id ? errorMessages.MSG_E0002 : errorMessages.MSG_E0003
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
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
            {errors.name && <p className='error_custom'>{errors.name.message}</p>}
            <label className='w3-text-blue'>
              <b>Release Date</b>
            </label>
            <input
              type='datetime-local'
              id='releaseDate'
              value={releaseDate}
              disabled={isReleaseDateDisabled || !isEditGame}
              {...register('releaseDate')}
              onChange={handleReleaseDateChange}
            ></input>
            {data?.id && isEditGame && (
              <p className='note'>
                *Note: Release Date will not change if the value of Status is Active.
              </p>
            )}
            <label className='w3-text-blue'>
              <b>Status</b>
            </label>
            <div className='select'>
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
