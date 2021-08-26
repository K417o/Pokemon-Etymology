import config from '../config.json';
import { handleResponse } from './handleResponse';

export const filterData = {
    getResults
};

function getResults(type, strict, colour, category) {

    let queryParams = "?";
    if (type.length === 0 && colour.length === 0 && category.length === 0) {
        queryParams = "";
    } else {
        if (type.length > 0 && strict == undefined) {
            strict = false;
        }
        type.map((x) => {
            queryParams += "type=" + x + "&"
        });

        queryParams += "strict=" + strict + "&"
        colour.map((x) => {
            queryParams += "colour=" + x + "&"
        });

        queryParams += "category=" + category + "&"

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