const wait = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

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

(async () => {
  const exchanges = await producer(0, consumer);
  console.log('All exchanges:', exchanges);
})();
