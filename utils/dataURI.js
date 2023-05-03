const DatauriParser = require('datauri/parser')

const parser = new DatauriParser()

const bufferToDataURI = (fileFormat, buffer) =>
  parser.format(fileFormat, buffer)

module.exports = {
  bufferToDataURI,
}


// The DatauriParser function here acts as a file format conversion passage. 
// We have a file called buffer that needs to be converted to data URI before
//  it can be uploaded to Cloudinary because Cloudinary doesn’t know what buffer is.
//  The parser will look for the file format .png or .jpg, and convert the buffer to a string.