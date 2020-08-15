import React, { useState, useEffect } from 'react'
import Card from './Card'
import './Hand.css'

const Hand = ({ 
    cards,
    setCards,
    turn, 
    changeTurn, 
    startingHand, 
    player, 
    requiredHandAmount, 
    setRequiredHandAmount, 
    mostRecentPlay, 
    setMostRecentPlay, 
    gameOver,
    setGameOver,
    allPlayedCards,
    setAllPlayedCards,
    setErrorMsg
    }) => {

    const [selectedCards, setSelectedCards] = useState([])

    const selectCard = async (card) => {
        !selectedCards.includes(card.code) ? setSelectedCards([...selectedCards, card.code]) : setSelectedCards(selectedCards.filter(item => item !== card.code))
    }

    const playHand = (playedCards) => {

        // assign values to denominations and suits
        const denominations = playedCards.map(item => item.charAt(0)).map(denomination => {
            if(denomination === "A") {
                return 14
            } else if (denomination === "K") {
                return 13
            } else if (denomination === "Q") {
                return 12
            } else if (denomination === "J") {
                return 11
            } else if (denomination === "2") {
                return 15
            } else if (denomination === "0") {
                return 10
            } else {
                return parseInt(denomination)
            }
        })
        

        const suits = playedCards.map(item => item.charAt(1)).map(suit => {
            if (suit === "D") {
                return 1
            } else if (suit === "C") {
                return 2
            } else if (suit === "H") {
                return 3
            } else if (suit === "S") {
                return 4
            }
        })
        

        
        // Show an error message if a player makes a play with 0 cards
        if (playedCards.length === 0) { 
            setErrorMsg({errorMsg: "You must play at least one card!", visibility: "visible"})
        }

        // Show an error message if a player plays a different amount of cards as the last player
        else if (requiredHandAmount !== null && playedCards.length !== requiredHandAmount) {
            setErrorMsg({errorMsg: `You must play the same number (${requiredHandAmount}) of card(s)`, visibility: "visible"})
        }

        else {
            
            const maxDenomination = denominations.reduce((a,b) => Math.max(a, b))
            const maxSuit = suits.reduce((a,b) => Math.max(a, b))

            switch(playedCards.length) {
                case 1:
                    // process the play if the played card is higher than the previous card or if it is the first card played in a round
                    if (mostRecentPlay.typeOfHand === null || denominations[0] > mostRecentPlay.max.denomination) {
                        setMostRecentPlay({typeOfHand: "single", max: {denomination: denominations[0], suit: suits[0]}})
                        setRequiredHandAmount(1)
                        finishPlay(playedCards)
                    }
                    // check if the played card has the same denomination
                    else if (denominations[0] === mostRecentPlay.max.denomination){
                        // show error message if the played card is the same denomination but a lower suit
                        if (suits[0] < mostRecentPlay.max.suit) {
                            setErrorMsg({errorMsg: "You need to play a card with a higher suit!", visibility: "visible"})
                        }
                        // process the play if the played card is the same denomination and higher suit
                        else {
                            setMostRecentPlay({typeOfHand: "single", max: {denomination: denominations[0], suit: suits[0]}})
                            setRequiredHandAmount(1)
                            finishPlay(playedCards)
                        }
                    }
                    else if (denominations[0] < mostRecentPlay.max.denomination) {
                        setErrorMsg({errorMsg: "You need to play a card with a larger denomination!", visibility: "visible"})
                    }
                    break;
                case 2:
                    // check if the two cards are a pair; return an error msg if they are not
                    if (denominations[0] !== denominations[1]) {
                        setErrorMsg({errorMsg: "You can only play two cards if it is a pair!", visibility: "visible"})
                    }
                    else if (maxDenomination === mostRecentPlay.max.denomination && maxSuit < mostRecentPlay.max.suit) {
                        setErrorMsg({errorMsg: "Your pair has a lower suit than the last played pair!", visibility: "visible"})
                    }
                    else if (maxDenomination < mostRecentPlay.max.denomination) {
                        setErrorMsg({errorMsg: "You cannot play a pair with a lower denomination!", visibility: "visible"})
                    }
                    else if (mostRecentPlay.typeOfHand === null || mostRecentPlay.typeOfHand === "pair") {
                        setMostRecentPlay({typeOfHand: "pair", max: {denomination: maxDenomination, suit: maxSuit}})
                        setRequiredHandAmount(2)
                        finishPlay(playedCards)
                    }
                    break;
                case 3:
                    // check if the three cards are a triple; return an error msg if they are not
                    if (denominations[0] !== denominations[1]  || denominations[1] !== denominations[2]) {
                        setErrorMsg({errorMsg: "You can only play three cards if it is a triple!", visibility: "visible"})
                    }
                    else if (maxDenomination < mostRecentPlay.max.denomination) {
                        setErrorMsg({errorMsg: "You cannot play a triple with a lower denomination!", visibility: "visible"})
                    }
                    else if (mostRecentPlay.typeOfHand === null || mostRecentPlay.typeOfHand === "triple") {
                        setMostRecentPlay({typeOfHand: "triple", max: {denomination: maxDenomination, suit: maxSuit}})
                        setRequiredHandAmount(3)
                        finishPlay(playedCards)
                    }
                    break;
                case 5:
                    const sortedDenominations = denominations.sort((a, b) => a - b)
                    console.log(sortedDenominations)
                    
                    // check if hand is a straight flush
                    if (suits[0] === suits[1] &&  
                        suits[1] === suits[2] && 
                        suits[2] === suits[3] && 
                        suits[3] === suits[4] 
                        && 
                        sortedDenominations[0] === sortedDenominations[1] - 1 
                        && sortedDenominations[1] === sortedDenominations[2] - 1 
                        && sortedDenominations[2] === sortedDenominations[3] - 1 
                        && sortedDenominations[3] === sortedDenominations[4] - 1) {
                        const straightFlushDenomination = sortedDenominations[4]
                        const straightFlushSuit = suits[0]
                        // if the most recent play was a straight flush...
                        if (mostRecentPlay.typeOfHand === "straightFlush" && mostRecentPlay.max.denomination > straightFlushDenomination) {
                            setErrorMsg({errorMsg: "Your straight flush has a lower denomination than the most recent hand!", visibility: "visible"})
                        } else if (mostRecentPlay.typeOfHand === "straightFlush" && mostRecentPlay.max.denomination === straightFlushDenomination) {
                            if (straightFlushSuit < mostRecentPlay.max.suit) {
                                setErrorMsg({errorMsg: "Your straight flush has a lower suit than the most recent hand!", visibility: "visible"})
                            } else {
                                setMostRecentPlay({typeOfHand: "straightFlush", max: {denomination: maxDenomination, suit: maxSuit}})
                                setRequiredHandAmount(5)
                                finishPlay(playedCards)
                            }
                        }
                        // if the most recent play was a different 5-card hand...
                        else {
                            setMostRecentPlay({typeOfHand: "straightFlush", max: {denomination: maxDenomination, suit: maxSuit}})
                            setRequiredHandAmount(5)
                            finishPlay(playedCards)
                        }
                    }

                    // check if hand is a 'four of a kind'
                    else if (sortedDenominations[0] === sortedDenominations[1] 
                            && sortedDenominations[1] === sortedDenominations[2] 
                            && sortedDenominations[2] === sortedDenominations[3]
                            || 
                            sortedDenominations[1] === sortedDenominations[2] 
                            && sortedDenominations[2] === sortedDenominations[3] 
                            && sortedDenominations[3] === sortedDenominations[4]) {
                        const fourOfAKindDenomination = sortedDenominations[1]
                        // if the most recent play was a straight flush...
                        if (mostRecentPlay.typeOfHand === "straightFlush") {
                            setErrorMsg({errorMsg: "A four-of-a-kind cannot beat a straight flush!", visibility: "visible"})
                        } 
                        else if (mostRecentPlay.typeOfHand === "fourOfAKind") {
                            if (fourOfAKindDenomination < mostRecentPlay.max.denomination) {
                                setErrorMsg({errorMsg: "Your four-of-a-kind is lower than the last play!", visibility: "visible"})
                            }
                            else {
                                setMostRecentPlay({typeOfHand: "fourOfAKind", max: {denomination: fourOfAKindDenomination, suit: maxSuit}})
                                setRequiredHandAmount(5)
                                finishPlay(playedCards)
                            }
                        }
                        else {
                            setMostRecentPlay({typeOfHand: "fourOfAKind", max: {denomination: fourOfAKindDenomination, suit: maxSuit}})
                            setRequiredHandAmount(5)
                            finishPlay(playedCards)
                        }
                    }

                    // check if hand is a 'full house'
                    else if (sortedDenominations[0] === sortedDenominations[1] 
                            && sortedDenominations[2] === sortedDenominations[3] 
                            && sortedDenominations[3] === sortedDenominations[4] 
                             ||
                             sortedDenominations[0] === sortedDenominations[1] 
                             && sortedDenominations[1] === sortedDenominations[2] 
                             && sortedDenominations[3] === sortedDenominations[4]) {
                        const fullHouseDenomination = sortedDenominations[2]
                        if (mostRecentPlay.typeOfHand === "straightFlush" || mostRecentPlay.typeOfHand === "fourOfAKind") {
                            setErrorMsg({errorMsg: "A full house cannot beat a straight flush or a four-of-a-kind!", visibility: "visible"})
                        }
                        else if (mostRecentPlay.typeOfHand === "fullHouse" && mostRecentPlay.max.denomination > fullHouseDenomination) {
                            setErrorMsg({errorMsg: "Your full house has a smaller denomination than the last full house!", visibility: "visible"})
                        }
                        else {
                            setMostRecentPlay({typeOfHand: "fullHouse", max: {denomination: fullHouseDenomination, suit: maxSuit}})
                            setRequiredHandAmount(5)
                            finishPlay(playedCards)
                        }
                    }

                    // check if hand is a 'flush'
                    else if (suits[0] === suits[1] &&  suits[1] === suits[2] && suits[2] === suits[3] && suits[3] === suits[4] ) {
                        const flushDenomination = sortedDenominations[4]
                        const flushSuit = suits[0]
                        
                        // if the most recent play was a straight flush, four-of-a-kind or full house...
                        if (mostRecentPlay.typeOfHand === "straightFlush" || mostRecentPlay.typeOfHand === "fourOfAKind" || mostRecentPlay.typeOfHand === "fullHouse") {
                            setErrorMsg({errorMsg: "A flush cannot beat a full house, four-of-a-kind, or a straight flush!", visibility: "visible"})
                        }
                        else if (mostRecentPlay.typeOfHand === "flush" && mostRecentPlay.max.denomination > flushDenomination) {
                            setErrorMsg({errorMsg: "Your flush has a lower denomination than the last played flush!", visibility: "visible"})
                        }
                        else if (mostRecentPlay.typeOfHand === "flush" && mostRecentPlay.max.denomination === flushDenomination) {
                            if (mostRecentPlay.max.suit > flushSuit) {
                                setErrorMsg({errorMsg: "Your flush has a lower suit than the last played suit!", visibility: "visible"})
                            }
                            else {
                                setMostRecentPlay({typeOfHand: "flush", max: {denomination: maxDenomination, suit: maxSuit}})
                                setRequiredHandAmount(5)
                                finishPlay(playedCards)
                            }
                        }
                        else {
                            setMostRecentPlay({typeOfHand: "flush", max: {denomination: maxDenomination, suit: maxSuit}})
                            setRequiredHandAmount(5)
                            finishPlay(playedCards)
                        }
                    }

                    // check if hand is a "straight"
                    else if (sortedDenominations[0] === sortedDenominations[1] - 1 && sortedDenominations[1] === sortedDenominations[2] - 1 && sortedDenominations[2] === sortedDenominations[3] - 1 && sortedDenominations[3] === sortedDenominations[4] - 1) {
                        const straightDenomination = sortedDenominations[4]
                        const straightSuit = suits[denominations.indexOf(denominations.reduce((a,b) => Math.max(a, b)))]
                        
                        // if the most recent play was a different hand
                        if (mostRecentPlay.typeOfHand === "straightFlush" || mostRecentPlay.typeOfHand === "fourOfAKind" || mostRecentPlay.typeOfHand === "fullHouse" || mostRecentPlay.typeOfHand === "flush") {
                            setErrorMsg({errorMsg: "A straight cannot beat any other type of hand!", visibility: "visible"})
                        }
                        else if (mostRecentPlay.typeOfHand === "straight" && mostRecentPlay.max.denomination > straightDenomination) {
                            setErrorMsg({errorMsg: "Your straight has a lower denomination than the last straight!", visibility: "visible"})
                        }
                        else if (mostRecentPlay.typeOfHand === "straight" && mostRecentPlay.max.denomination === straightDenomination) {
                            if (mostRecentPlay.max.suit > straightSuit) {
                                setErrorMsg({errorMsg: "Your straight has a lower suit than the last straight!", visibility: "visible"})
                            }
                            else {
                                setMostRecentPlay({typeOfHand: "straight", max: {denomination: straightDenomination, suit: straightSuit}})
                                setRequiredHandAmount(5)
                                finishPlay(playedCards)
                            }
                        }
                        else {
                            setMostRecentPlay({typeOfHand: "straight", max: {denomination: straightDenomination, suit: straightSuit}})
                            setRequiredHandAmount(5)
                            finishPlay(playedCards)
                        }
                    }

                    // if the five cards do not belong to any hand...
                    else {
                        setErrorMsg({errorMsg: "Your cards do not form a valid five-card hand!", visibility: "visible"})
                    }
                    break;
                default:
                    break;
            }
        }
    }

    const checkWinner = (remainingCards) => {
        if (remainingCards.length === 0) {
            console.log(`Game Over! Player ${turn} wins.`)
            setGameOver(!gameOver)
        }
    }


    const finishPlay = async (playedCards) => {

            let thisTurnCards = []
            // // newRemainingCards are all the cards in the hand that are not played
            let newRemainingCards = cards[turn]
            for (let i=0; i<playedCards.length; i++) {
                for (let j=0; j < newRemainingCards.length; j++) {
                    if (newRemainingCards[j].code === playedCards[i]) {
                        thisTurnCards.push(newRemainingCards[j])
                        newRemainingCards.splice(j, 1)
                    }
                } 
            }

            await setCards({...cards, [turn]: newRemainingCards})
            
            setAllPlayedCards([...allPlayedCards,...thisTurnCards])
            
            // Unselect the selected cards
            setSelectedCards(() => [])

            // Check if there is a winner
            checkWinner(newRemainingCards)

            setErrorMsg({errorMsg: null, visibility: "hidden"})

            // Change turns
            changeTurn()
    }

    const pass = () => {
        
        setErrorMsg({errorMsg: null, visibility: "hidden"})

        // Change turns to the other player
        changeTurn()

        // Unselect the selected cards (if there are any)
        setSelectedCards(() => [])

        // Reset the type of hand to "null"
        setMostRecentPlay({typeOfHand: null, max: {denomination: null, suit: null}})

        // Set the required hand amount to null
        setRequiredHandAmount(null)
    }

    return (
        <div className={`Player${player}Hand`}>
            <h3 className="handTitle"> Player {player}'s Hand</h3>
            <button disabled={gameOver} className="playHandBtn" onClick={() => {turn === player ? playHand(selectedCards) : setErrorMsg({errorMsg: "It is not your turn yet!", visibility: "visible"})} }>Play Hand</button>
            <button disabled={gameOver} className="passBtn" onClick={() => {turn === player ? pass() : setErrorMsg({errorMsg: "It is not your turn yet!", visibility: "visible"})}}>Pass</button>
            <div className="Hand-cards">
            {startingHand.map(card => 
                <Card 
                    img={card.image}
                    key={card.code}
                    value={card.code}
                    suit={card.code.charAt(1)}
                    denomination={card.code.charAt(0)}
                    selectCard={turn === player 
                        ? 
                        () => selectCard(card) 
                        : 
                        () => setErrorMsg({errorMsg: "It is not your turn yet!", visibility: "visible"})
                    }
                    selected={selectedCards.includes(card.code) ? true : false}
                />
            )}
            </div>
        </div>
    )
}

export default Hand