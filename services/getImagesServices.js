const fs = require('fs');

const getImagesServices = {}
const imageDirPath = 'uploads'

function getAllImages(dirPath, arrayOfFiles) {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllImages(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(dirPath + "/" + file)
        }
    })

    return arrayOfFiles
}

getImagesServices.collectImages = () => {
    return getAllImages(imageDirPath)
}
module.exports = getImagesServices