import React from 'react'
import './Card.css'

const Card = (props) => {
    return (
        <div className={`Card ${props.selected === true ? "selected" : "notSelected"}`} >
            <img src={props.img} onClick={props.selectCard} alt=""/>
        </div>
    )
}

export default Card
