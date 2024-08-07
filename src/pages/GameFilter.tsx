import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useAppSelector } from '~/redux/hooks'
import { getAllGameStatus } from '~/types/enum'
import { GameItems } from '~/types/game.type'

const formSchema = z.object({
  name: z.string().optional(),
  status: z.string().optional()
})

interface GameFilterProps {
  setGames: React.Dispatch<React.SetStateAction<GameItems[]>>
}
function GameFilter({ setGames }: Readonly<GameFilterProps>) {
  const games = useAppSelector(state => state.gameReducer.games)
  const { handleSubmit, register, reset } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: undefined,
      status: undefined
    },
    shouldUnregister: true
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, status } = values
    if (!name && !status) return
    const filteredGames = games.filter(game => {
      const matchesName = name ? game.name.toLowerCase().includes(name.toLowerCase()) : true
      const matchesStatus = status ? game.status === status : true
      return matchesName && matchesStatus
    })
    setGames(filteredGames)
  }

  const clearFilter = () => {
    reset()
    setGames(games)
  }
  return (
    <div className='w3-card-4 filter_container'>
      <form className='w3-container form_custom' onSubmit={handleSubmit(onSubmit)}>
        <div className='status_display'>
          <i className='fa fa-filter'></i>
          <label className='w3-text-blue'>
            <b>Filter Results</b>
          </label>
        </div>
        <label>
          <b>Name:</b>
        </label>
        <input
          className='w3-input w3-border'
          type='text'
          placeholder='Search by name'
          {...register('name')}
        ></input>
        <label>
          <b>Status:</b>
        </label>
        <div className='select'>
          <select {...register('status')}>
            <option value=''>---</option>
            {getAllGameStatus().map((status, index) => (
              <option value={status} key={index}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className='btn_actions'>
          <button className='btn_red btn btn_with_icon' type='button' onClick={clearFilter}>
            <i className='fa fa-trash'></i>
            Clear
          </button>
          <button className='btn_blue btn btn_with_icon' type='submit'>
            <i className='fa fa-search'></i>
            Search
          </button>
        </div>
      </form>
    </div>
  )
}

export default GameFilter
