import React, { useState, useEffect } from 'react';
import axios from 'axios';

import classes from './Content.module.css';
import ValidationMessage from '../components/ValidationMessage/ValidationMessage';
import Result from '../components/Result/Result';

const Content = () => {

    const [numbers, setNumbers] = useState([]);
    const [median, setMedian] = useState();
    const [inputError, setInputError] = useState('');
    const [calculateDisabled, setCalculateDisabled] = useState(true);

    useEffect(() => {
        setCalculateDisabled(numbers.length < 1);

        if (inputError) {
            setInputError('');
        };

    }, [numbers]);

    const medianInputChangeHandler = (changeEvent) => {
        const changeValue = changeEvent.target.value;
        setNumbers(changeValue);
    };

    const validateInputNumbers = () => {
        let inputRegex = new RegExp('^[1-8](,[1-8])*$');

        if (!inputRegex.test(numbers)) {
            setInputError('Liczby zostały wprowadzone w niedozwolonym formacie!');
            return false;
        };

        return true;
    };

    const calculateHandler = () => {
        const validationResult = validateInputNumbers();
        if (!validationResult)
            return;

        const medianNumbersObject = {
            numbers: numbers.replace(/, +/g, ",").split(",").map(Number)
        };

        axios.post('http://localhost:8080/api/median', medianNumbersObject).then(response => {
            if (response.status === 200) {
                const calculatedMedian = response.data.median;
                setMedian(calculatedMedian);
            };
        }).catch(err => {
            setInputError('Obliczenie mediany nie powiodło się!');
        });
    };

    return (
        <div className={classes.Content}>
            <p className={classes.Header}>Wprowadź po przecinku liczby, dla których chcesz policzyć medianę.</p>
            <input onChange={medianInputChangeHandler} className={classes.MedianInput} />
            {inputError ? <ValidationMessage message={inputError} /> : null}
            <button onClick={calculateHandler} disabled={calculateDisabled} className={classes.CalculateButton}>Oblicz</button>
            {median ? <Result median={median} /> : null}
        </div>
    );
};

export default Content;