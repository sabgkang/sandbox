const request = require('request')

//request.post('http://ugym3dbiking.azurewebsites.net/api/SQL_BikingTrainingResult?Code=debug123', {
//  json: {
//    "sqlCmd": "SELECT * FROM BikingTrainingResult"
//  }
//}, (error, res, body) => {
//  if (error) {
//    console.error(error)
//    return
//  }
//  console.log(`statusCode: ${res.statusCode}`)
//  console.log(body)
//})

request.post('http://ugym3dbiking.azurewebsites.net/api/SQL_CmdReadCols?Code=debug123', {
  json: {
    "sqlCmd": "SELECT SUM(distance) AS A1, AVG(distance) AS A2 FROM BikingTrainingResult WHERE userId = 'oxyoO1eNcR300-DRcfU4vrhyTigo' ",

    "sqlCols": [
		"A1",
		"A2"
	]
  }
}, (error, res, body) => {
  if (error) {
    console.error(error)
    return
  }
  console.log(`statusCode: ${res.statusCode}`)
  console.log("Sum of the distance is ", body.obj[0])
  console.log("Average of the distance is ", body.obj[1])
})