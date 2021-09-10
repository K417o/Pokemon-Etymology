import config from '../config.json';
import { handleResponse } from './handleResponse';

export const filterData = {
    getResults,
    getPkmn
};

function getResults(type, strict, colour, category, origin) {

    let queryParams = "?";
    if (type.length === 0 && colour.length === 0 && category.length === 0 && origin.length === 0) {
        queryParams = "";
    } else {
        if (type.length > 0 && strict === undefined) {
            strict = false;
        }
        queryParams += "strict=" + strict;
        if (type.length > 0) {
            for (let i = 0; i < type.length; i++) {
                queryParams += "&type=" + type[i];
            }
        }



        if (colour.length > 0) {
            for (let i = 0; i < colour.length; i++) {
                queryParams += "&colour=" + colour[i];
            };

        }
        if (category.length > 0) {
            queryParams += "&category=" + category;
        }

        if (origin.length > 0) {
            for (let i = 0; i < origin.length; i++) {
                queryParams += "&origin=" + origin[i].entity
            };

        }

    }

    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.api_Link}/pokemon` + queryParams, requestOptions)
        .then(handleResponse)
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
        });
};

function getPkmn(name) {
    const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    };

    return fetch(`${config.api_Link}/pokemon/${name}`, requestOptions)
        .then(handleResponse)
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log(err);
        });
};