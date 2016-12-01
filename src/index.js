import Hapi from 'hapi';
import Boom from 'boom';
import Joi  from 'joi';

const ENV = process.env.NODE_ENV || 'development';

const server = new Hapi.Server();
server.connection({
  port: 4000
});


server.register([
  require('blipp'),
  require('hapi-async-handler'),
  {
    register: require('hapi-router'),
    options: {
      routes: 'src/**/*.routes.js'
    }
  },
  {
    register: require('good'),
    options: {
      // ops: {
      //   // interval: 1000
      // },
      reporters: {
        myConsoleReporter: [
          {
            module: 'good-console'
          }, 'stdout'
        ]
      }
    }
  }], err => {
  if (err) throw err;
  
  server.route({
    method: 'GET',
    path: '/hello/{name}',
    config: {
      validate: {
        params: {
          name: Joi.string().min(3).max(10)
        },
        query: {
          greeting: Joi.string().min(2).optional()
        }
      }
    },
    handler: {
      async: async(request, reply) => {
        throw Boom.badRequest('Missing name', {});
        
        // const results = await getDataFromDB();
        return reply({ hello: "World" })
      }
    }
  });
  
  server.route({
    method: 'POST',
    path: '/greet',
    config: {
      validate: {
        payload: Joi.object({
          email: Joi.string().required()
        })
      }
    },
    handler: {
      async: async(request, reply) => {
        const { payload } = request;
        console.log(payload.email);
        
        // const results = await getDataFromDB();
        return reply(payload);
      }
    }
  });
  
  if(ENV !== 'testing') {
    server.start((err) => {
      if (err) {
        throw err;
      }
      console.log('Server running at:', server.info.uri);
    });
  }
  
  
  
});



