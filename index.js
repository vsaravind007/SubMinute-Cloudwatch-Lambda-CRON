const AWS = require('aws-sdk')
const NanoTimer = require('nanotimer')
const lambda = new AWS.Lambda()

const timerObject = new NanoTimer()

module.exports.source = (event, context, callback) => {
  // Your Destination lambda ARN here
  const LAMBDA_ARN = 'arn:aws:lambda:REGION:ACCOUNT_ID:function:FUNCTION_NAME'
  const INTERVAL = parseInt(process.env.INTERVAL) || 1
  const START_TIME = new Date().toISOString()
  console.log('Starting timer at', START_TIME)
  let INVOCATION_COUNT = 0
  console.log('Setting up timer')
  timerObject.setInterval(function () {
    console.log('Inside timer')
    INVOCATION_COUNT++
    if (INVOCATION_COUNT >= 7) {
      timerObject.clearInterval()
      console.log('Done invocations')
      return callback(null, { message: 'Inovcation complete' })
    }
    let INVOCATION_TIME = new Date().toISOString()
    let lambdaParams = {
      FunctionName: LAMBDA_ARN,
      InvocationType: 'Event',
      Payload: JSON.stringify({
        START_TIME: START_TIME,
        INVOCATION_TIME: INVOCATION_TIME,
        INTERVAL: INTERVAL,
        INVOCATION_COUNT: INVOCATION_COUNT
      })
    }
    console.log(INVOCATION_COUNT)
    lambda.invoke(lambdaParams, function (error, data) {
      console.log('Invocation result', error, data)
    })
  }, '', '10s')
}

module.exports.destination = (event, context, callback) => {
  console.log('Lambda Invoked!', new Date().toISOString())
  return callback(null, { message: 'destination invoked!' })
}
