import config from '../config.json';
import { handleResponse } from './handleResponse';

export const getAll = {
    types,
    categories,
    colours,
    pokemon
};

function types() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.api_Link}/types`, requestOptions)
        .then(handleResponse)
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
        });
};

function categories() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.api_Link}/categories`, requestOptions)
        .then(handleResponse)
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
        });
};

function colours() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.api_Link}/colours`, requestOptions)
        .then(handleResponse)
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
        });
};

function pokemon() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.api_Link}/pokemon/all`, requestOptions)
        .then(handleResponse)
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
        });
};