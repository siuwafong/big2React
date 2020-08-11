import React, { Fragment } from 'react';
import spinner from '../layout/spinner.gif'
import './Loading.css'

export default () => (
    <div className="loadingContainer" >
        <img
            className="loadingIcon"
            src={spinner}
            alt='Loading...'
        />
    </div>
)