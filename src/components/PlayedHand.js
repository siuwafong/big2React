import React from 'react'
import PlayedCard from './PlayedCard'
import './PlayedHand.css'

export const PlayedHand = ({ mostRecentPlay, allPlayedCards }) => {

    let handMsg = "";
    let playedDenomination = "";
    let playedSuit = "";

    if (mostRecentPlay.max.denomination === 11) {
        playedDenomination = "Jack"
    } else if (mostRecentPlay.max.denomination === 12) {
        playedDenomination = "Queen"
    } else if (mostRecentPlay.max.denomination === 13) {
        playedDenomination = "King"
    } else if (mostRecentPlay.max.denomination === 14) {
        playedDenomination = "Ace"
    } else if (mostRecentPlay.max.denomination === 15) {
        playedDenomination = 2
    } else {
        playedDenomination = mostRecentPlay.max.denomination
    }

    if (mostRecentPlay.max.suit === 1) {
        playedSuit = "Diamonds"
    } else if (mostRecentPlay.max.suit === 2) {
        playedSuit = "Clubs"
    } else if (mostRecentPlay.max.suit === 3) {
        playedSuit = "Hearts"
    } else if (mostRecentPlay.max.suit === 4) {
        playedSuit = "Spades"
    } 


    if (mostRecentPlay.typeOfHand === "single") {
        handMsg = `Single - ${playedDenomination} of ${playedSuit}`
    } else if (mostRecentPlay.typeOfHand === "pair") {
        handMsg = `Pair of ${playedDenomination}s with ${playedSuit}`
    } else if (mostRecentPlay.typeOfHand === "triple") {
        handMsg = `Triple ${playedDenomination}s `
    } else if (mostRecentPlay.typeOfHand === "straight") {
        handMsg = `Straight - Max of ${playedDenomination} of ${playedSuit}`
    } else if (mostRecentPlay.typeOfHand === "flush") {
        handMsg = `Flush - ${playedSuit} with a max of ${playedDenomination}`
    } else if (mostRecentPlay.typeOfHand === "fullHouse") {
        handMsg = `Full House with ${playedDenomination}s`
    } else if (mostRecentPlay.typeOfHand === "fourOfAKind") {
        handMsg = `Four of a Kind - ${playedDenomination}s`
    } else if (mostRecentPlay.typeOfHand === "straightFlush") {
        handMsg = `Straight Flush with a max of ${playedDenomination} of ${playedSuit}`
    }
    
    return (
        <div>
            {mostRecentPlay.typeOfHand !== null && `Last Played Hand: ${handMsg}`}
            <div className="PlayedHand">
                {allPlayedCards.map(c => (
                    <PlayedCard image={c.image} name={c.code} key={c.code}/>
                ))}
            </div>
        </div>
    )
}

export default PlayedHand