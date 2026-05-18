const Imagekit = require('imagekit')

const upload = new Imagekit ({
    publicKey: process.env.IMAGEKIT_PUBLIC,
    privateKey: process.env.IMAGEKIT_PRIVATE,
    urlEndpoint: process.env.IMAGEKIT_WEB_URL
})

module.exports = upload;