export default {
  method: 'GET',
  path: '/greetings',
  handler: {
    async: async (request, reply) => reply('Yo')
  }
}
