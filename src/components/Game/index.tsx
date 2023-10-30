import { DragDropContext, type DropResult } from 'react-beautiful-dnd'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import useSound from 'use-sound'
import selectionSound from '@/assets/material_product_sounds/wav/primary/navigation_forward-selection-minimal.wav'
import simpleSoundEnd from '@/assets/material_product_sounds/wav/primary/navigation_backward-selection-minimal.wav'
import selectionSoundEnd from '@/assets/material_product_sounds/wav/hero/hero_simple-celebration-03.wav'
import { Player } from '../Player'
import Square from '../Square'
import { gameBoard } from './styles.css'
import { useGame } from '@/hooks/useGame'
import { PlayerModel } from '@/models/Player.model'
import { initalBoard } from '@/utils/constants'
import { SquareKey } from '@/models/Game.model'
import { GameContainer } from '../GameContainer'
import { FC, useEffect, useState } from 'react'
import { encryptStorage } from '@/utils/storage'

type GameProps = {
  online?: boolean
}

export const Game: FC<GameProps> = ({ online = false }) => {
  const [playDragStart] = useSound(selectionSound, {
    volume: 2.5
  })
  const [playDragEnd] = useSound(selectionSoundEnd, {
    volume: 1
  })
  const [playSimpleDragEnd] = useSound(simpleSoundEnd, {
    volume: 2.2
  })

  const [publisherPlayer, setPublisherPlayer] =
    useState<PlayerModel>('player_one')
  const [subscriberPlayer, setSubscriberPlayer] =
    useState<PlayerModel>('player_two')

  const { movePuppet } = useGame(online)

  const handleDragEnd = async (result: DropResult) => {
    const destination = result?.destination
    const splittedDraggableItem = result.draggableId!.split('-')
    const [, player, size] = splittedDraggableItem

    try {
      await movePuppet({
        puppet: {
          puppet_id: result?.draggableId,
          player_id: player as PlayerModel,
          size: Number(size)
        },
        square_id: destination?.droppableId as SquareKey
      })

      playDragEnd()
    } catch (error) {
      playSimpleDragEnd()

      if (error instanceof Error) {
        console.warn(error?.message)
      }
    }
  }

  useEffect(() => {
    if (online) {
      const current_player = encryptStorage.getItem('player')

      setPublisherPlayer(current_player)

      if (current_player === 'player_one') {
        setSubscriberPlayer('player_two')
        return
      }

      setSubscriberPlayer('player_one')
    }
  }, [])

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
      onDragStart={() => {
        playDragStart()
      }}
    >
      <GameContainer>
        <Player player={subscriberPlayer} disabled={online} />

        <div className={gameBoard}>
          {initalBoard?.map((square, index) => (
            <Square key={index} squareId={square} />
          ))}
        </div>

        <Player player={publisherPlayer} />
      </GameContainer>
    </DragDropContext>
  )
}
