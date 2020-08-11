import React, { useState, Fragment } from 'react'
import Hand from './Hand'
import PlayedHand from './PlayedHand'
import Loading from './Loading'
import ErrorMsg from './ErrorMsg'
import './Game.css'


const Game = ({ setBackgroundColour}) => {

    const [cards, setCards] = useState({1: [], 2: []})
    const [gameStart, setGameStart] = useState(false)
    const [gameOver, setGameOver] = useState(false)
    const [turn, setTurn] = useState("1")
    const [allPlayedCards, setAllPlayedCards] = useState([])
    const [requiredHandAmount, setRequiredHandAmount] = useState(null)
    const [loading, setLoading] = useState(false)
    const [gameCards, setGameCards] = useState(26)
    
    const [errorMsg, setErrorMsg] = useState({
        errorMsg: null,
        visibility: "hidden"
    })

    const [mostRecentPlay, setMostRecentPlay] = useState({
        max: {
            denomination: null,
            suit: null
        },
        typeOfHand: null
    })

 
    const startGame = () => {
        let initialCards = []
        setLoading(true)
        fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            .then(res => res.json())
            .then(data => fetch(`https://deckofcardsapi.com/api/deck/${data.deck_id}/draw/?count=${gameCards}`)) 
            .then(res => res.json())  
            .then(data => initialCards = data.cards.map(card => card))
            .then(() => setCards({1: initialCards.slice(0, (initialCards.length / 2)), 2: initialCards.slice((initialCards.length /2 ), initialCards.length + 1)}))   
            .then(() => setLoading(false))
    }

    const changeTurn = () => {
        turn === "1" ? setTurn(() => "2") : setTurn(() => "1")
    }

    const handleCardChange = e => {
        setGameCards(parseInt(e.target.value) * 2)
    }

    const handleColourChange = e => {
        setBackgroundColour(e.target.value)
    }

    const restartGame = () => {
        setGameOver(false); 
        setTurn(() => "1");
        setGameStart(false);
        setRequiredHandAmount(null);
        setMostRecentPlay({
            max: {
                denomination: null,
                suit: null
            },
            typeOfHand: null
        })
        setAllPlayedCards([])
        setBackgroundColour("white")
    }

    return (
        <div className="Game">
            {gameStart === false
            ?
                <div className="gameStartContainer">
                    <div className="gameStartModal">
                        <h2 className="modalText">Big 2</h2>
                        <div className="introText">
                            Big 2 is a card game where the objective is for the player to play all their cards in their hand before other players.
                            Players can play single cards, pairs, triples and poker hands.  In each turn, players must play the same number of cards that have a higher value than the 
                            last played hand.  
                            
                            <div className="linkInfo">
                            To learn more about the game, click <a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Big_two">here</a>.
                            </div>
                        </div>
                        
                        <h3 className="modalText">Options</h3>
                        
                        <div className="cardQtyOption">
                        <label className="modalText" for="cardQty">Number of Cards Per Player (between 2 and 26):</label>
                        <input style={{marginLeft: "10px"}}value={gameCards / 2} id="cardQty" type="number"  placeholder="Number of Cards (default: 13)" min="2" max="26" onChange={e => handleCardChange(e)} />
                        </div>

                        <div className="radioOption">
                            <label style={{marginRight: "10px"}}className="modalText">Background Colour:</label>
                        
                            <input defaultChecked type="radio" id="whiteBackground" name="background" value="white" onChange={e => handleColourChange(e)}/>
                            <label className="modalText" for="whiteBackground" style={{marginRight: "10px"}}>White</label>

                            <input  type="radio" id="greenBackground" name="background" value="forestgreen" onChange={e => handleColourChange(e)} />
                            <label className="modalText" for="greenBackground">Green</label>
                        </div>

                        <button className="gameStartButton" onClick={() => {startGame(); setGameStart(!gameStart)}} >Start a New Game</button>
                    </div>
                </div>
            :
            loading === true 
                ?
                <Loading />
                :
                <Fragment>
                    <button className="restartBtn" onClick={() => restartGame()}>Restart Game</button>
                    <Hand 
                        startingHand={cards[1]} 
                        player={"1"} 
                        turn={turn} 
                        setTurn={setTurn} 
                        requiredHandAmount={requiredHandAmount}
                        setRequiredHandAmount={setRequiredHandAmount}
                        mostRecentPlay={mostRecentPlay}
                        setMostRecentPlay={setMostRecentPlay}
                        changeTurn={changeTurn}
                        cards={cards}
                        setCards={setCards}
                        gameOver={gameOver}
                        setGameOver={setGameOver}
                        allPlayedCards={allPlayedCards}
                        setAllPlayedCards={setAllPlayedCards}
                        setErrorMsg={setErrorMsg}  
                    />
                    <h1> Player {turn}'s Turn </h1>
                    <ErrorMsg errorMsg={errorMsg} setErrorMsg={setErrorMsg}  />
                    {gameOver 
                    &&
                    <div>
                        <h2> Game Over!  Player {turn} wins.</h2>
                        <button className="gameOverBtn" onClick={() => {
                                restartGame()
                            }
                        }> Play Again</button>
                    </div>  
                    }
                    
                    {mostRecentPlay.typeOfHand !== null 
                    ? 
                    <Fragment></Fragment>
                    : 
                    <div>You can play any card(s) on this turn.</div>}
                    <PlayedHand 
                        mostRecentPlay={mostRecentPlay} 
                        allPlayedCards={allPlayedCards}
                        mostRecentPlay={mostRecentPlay} 
                    />

                    <Hand 
                        startingHand={cards[2]} 
                        player={"2"} 
                        turn={turn} 
                        setTurn={setTurn} 
                        setCards={setCards}
                        requiredHandAmount={requiredHandAmount}
                        setRequiredHandAmount={setRequiredHandAmount}
                        mostRecentPlay={mostRecentPlay}
                        setMostRecentPlay={setMostRecentPlay} 
                        changeTurn={changeTurn} 
                        cards={cards}
                        gameOver={gameOver}
                        setGameOver={setGameOver}
                        allPlayedCards={allPlayedCards}
                        setAllPlayedCards={setAllPlayedCards} 
                        setErrorMsg={setErrorMsg}               
                    />
                    
                </Fragment>}
                <div className="developedByMsg">
                        Developed by Wilson Fong
                </div>
        </div>
    )
}

export default Game
