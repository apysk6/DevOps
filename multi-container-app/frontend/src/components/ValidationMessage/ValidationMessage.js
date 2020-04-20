import React from 'react';
import classes from './ValidationMessage.module.css';

const ValidationMessage = ({ message, type }) => {

    return (
        <div className={classes.ValidationMessage}>
            <span className={classes.ValidationSpan}>{message}</span>
        </div>
    );
};

export default ValidationMessage;