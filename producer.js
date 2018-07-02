const { wait } = require('./example-utils');

async function producer(type, consumer, payload) {
  if (type === 0) {
    console.log('Producer ready.');
    return consumer(0, producer);
  }
  if (type === 1) {
    const { orders = [], previous = 0, action = null } = payload;
    console.log('Last orders:', orders.slice(-3));
    await wait(1);
    console.log('Producer sends:', previous + 1);
    if (action) {
      console.log('Producer applies action.');
      const next = await action(previous + 1);
      return consumer(1, producer, {
        acc: orders,
        current: next
      });
    }
    return consumer(1, producer, { acc: orders, current: previous + 1 });
  }
  if (type === 2) {
    return console.log('Producer stops sending.');
  }
}

module.exports = producer;
