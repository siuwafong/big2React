import { cards, setCards } from '../components/Game'

export const playHand = (playedCards) => {
    console.log(`Played Cards: ${playedCards}`)
    setCards(() => [])
}