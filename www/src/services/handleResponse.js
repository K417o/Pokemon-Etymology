export function handleResponse(response) {
    if (response.ok) {
        if (!!response.json) {
            return response.json();
          } else if (response.text) {
            return response.text().then((text) => JSON.parse(text));
          }
    } else {
      return Promise.reject({
        status: response.status,
        statusText: response.statusText,
      });
    }

}