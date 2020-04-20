import React from 'react';

import classes from './Result.module.css'

const Result = ({ median }) => {
    return (
        <div className={classes.Result}>
            <p className={classes.Header}>Mediana</p>
            <p>Mediana wynosi: {median} </p>
        </div>
    );
};

export default Result;