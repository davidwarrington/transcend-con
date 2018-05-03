/**
 * Convert strings to slugs 
 * by making them lowercase,
 * then removing all 
 * characters that aren't 
 * alphanumerical (a-z or 
 * 0-9), or spaces or hyphens, 
 * before finally replacing 
 * all spaces with hyphens.
 */
const slugify = text => text.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/ /g, '-');


module.exports = slugify;