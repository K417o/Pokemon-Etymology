import config from '../config.json';
import { handleResponse } from './handleResponse';

export const getAll = {
    types,
    categories,
    colours,
    pokemon,
    origins
};

function types() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.api_Link}/types`, requestOptions)
        .then(handleResponse)
        .then(data => {
            let type = [];

            for (let i = 0; i < data.length; i++){
                if(data[i].charAt(0) === ":"){
                    type.push(data[i].substring(1));
                } else {
                    type.push(data[i]);
                }
            }
            return type;
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
            let categories = [];
            for (let i = 0; i < data.length; i++){
                if (data[i].charAt(data[i].length - 1) === " ") {
                    categories.push(data[i].substring(0, data[i].length-1))
                } else {
                    categories.push(data[i]);
                }
            }
            console.log(categories)
            return categories;
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

function origins() {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.api_Link}/origins`, requestOptions)
        .then(handleResponse)
        .then(data => {
            let origins = [];
            for (let i in data){
                if (!!data[i].label && !!data[i].entity){
                    origins.push(data[i]);
                }
            }
            return origins;
        })
        .catch(err => {
            console.log(err);
        });
};