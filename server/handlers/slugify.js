/**
 * Convert strings to slugs 
 * by making them lowercase 
 * and replacing all spaces 
 * with hyphens.
 */
const slugify = text => text.toLowerCase().replace(/ /g, '-').replace(/'/g, '');

module.exports = slugify;