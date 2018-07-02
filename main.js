const producer = require('./producer');
const consumer = require('./consumer');

(async () => {
  const exchanges = await producer(0, consumer);
  console.log('All exchanges:', exchanges);
})();
