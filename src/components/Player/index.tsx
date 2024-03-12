import { FC } from 'react'
import { Puppet } from '../Puppet'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useGameStore } from '@/store/game/game.store'

import { draggableContainer } from './styles.css'
import { PlayerProps } from './types'
import { theme } from '@/styles/theme.css'

const player_turn_color = {
  player_one: theme.colors.primary,
  player_two: theme.colors.secondary
}

export const Player: FC<PlayerProps> = ({
  player,
  disabled = false,
  isTurn,
  subscriber,
  online
}) => {
  const puppets = useGameStore((state) => state[player])
  const player_names = useGameStore((state) => state.player_names)

  return (
    <Droppable droppableId={player} direction="horizontal">
      {(provided) => (
        <div
          style={{
            display: 'flex',
            flexDirection: subscriber ? 'column' : 'column-reverse',
            gap: '0.2rem',
            alignItems: 'center'
          }}
        >
          <div
            ref={provided.innerRef}
            className={draggableContainer}
            {...provided.droppableProps}
          >
            {puppets?.map((item, index) => (
              <Draggable
                key={item.puppet_id}
                index={index}
                draggableId={item.puppet_id}
              >
                {(providedChild) => (
                  <Puppet
                    size={item.size}
                    player={item.player_id}
                    ref={providedChild.innerRef}
                    {...(!disabled && {
                      ...providedChild.draggableProps,
                      ...providedChild.dragHandleProps
                    })}
                    style={providedChild.draggableProps.style}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>

          {isTurn && (
            <h1
              style={{
                color: player_turn_color[player]
              }}
            >
              {online ? player_names?.[player] : player?.split('_')[0]}{' '}
              {online ? '' : player?.split('_')[1]} can play!
            </h1>
          )}
        </div>
      )}
    </Droppable>
  )
}
