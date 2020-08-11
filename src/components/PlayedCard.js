import React, { Component } from 'react'
import './PlayedCard.css'

class PlayedCard extends Component {
    constructor(props) {
        super(props)
        let angle = Math.random() * 90 -45;
        let xPos = Math.random() * 40 - 20;
        let yPos = Math.random() * 40 -20;
        this._transform = `translate(${xPos}px, ${yPos}px) rotate(${angle}deg)`
    }

    render() {
        return (
            <div className="PlayedCard">
                <img 
                    className="Card" 
                    style={{transform: this._transform}}
                    alt={this.props.name}
                    src={this.props.image}
                />
            </div>
        )
    }
}


export default PlayedCard
