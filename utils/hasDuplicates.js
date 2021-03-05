module.exports = (array) => {
    array = array.map(item => isString(item) ? item.toLowerCase().trim() : item)
    return (new Set(array)).size !== array.length;
}

const isString = (elem) => {
    return typeof elem === "string"
}