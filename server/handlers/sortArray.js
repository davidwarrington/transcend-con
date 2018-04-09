/**
 * compare
 * 
 * Used to compare array 
 * values for sorting.
 * 
 * Found here: 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 * @param {object} a First object
 * @param {object} b Second object
 */
const compare = (a, b) => {
    /**
     * Comparison conditions.
     * 
     * If less than 0, a comes first.
     * If than 0, a comes last.
     * If 0, leave unchanged.
     */
    if (a.slug < b.slug) return -1;
    if (a.slug > b.slug) return 1;
    return 0;
}

module.exports = compare;