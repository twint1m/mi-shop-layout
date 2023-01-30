const apiPath = 'http://localhost:3001'

export const getData = (path) => {
    return fetch(apiPath + path).then(response => response.json())
}