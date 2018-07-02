const { wait } = require('./example-utils');

async function consumer(type, producer, payload) {
  if (type === 0) {
    console.log('Consumer ready.');
    return producer(1, consumer, 'Start sending!');
  }
  if (type === 1) {
    const { acc, current } = payload;
    await wait(1);
    const orders = acc.concat(current);
    console.log(`Consumer received: ${current}`);
    if (current > 19) {
      console.log('Stop sending...');
      producer(2);
      return orders;
    } else if (current % 3 === 0) {
      console.log('Consumer requests action...');
      const action = (value) =>
        new Promise((resolve) => {
          console.log('Action: wait for 3s');
          setTimeout(() => {
            resolve(value);
          }, 3000);
        });
      return producer(1, consumer, {
        orders,
        previous: current,
        action
      });
    }
    return producer(1, consumer, { orders, previous: current });
  }
}

module.exports = consumer;
