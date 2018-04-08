const slugify = text => text.toLowerCase().replace(/ /g, '-');

module.exports = slugify;