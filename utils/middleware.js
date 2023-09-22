const noHandlers = (request, response) => {
    response.status(404).send("no code available to handle this request")
  }


const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === "ValidationError"){
      return response.status(400).json({ error: error.message })

    }
  
    next(error)
  }

  const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('we just wrote this code')
    next()
  }

  module.exports = {
    errorHandler,noHandlers,requestLogger

  }