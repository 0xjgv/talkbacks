const wait = (seconds) =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

async function producer(type, consumer, payload) {
  if (type === 0) {
    console.log('Producer ready.');
    return consumer(0, producer);
  } else if (type === 1) {
    const { orders = [], previous = 0, action = null } = payload;
    console.log('Last orders:', orders);
    await wait(1);
    console.log('Producer sends:', previous + 1);
    if (action) {
      console.log('Producer applies action.');
      return consumer(1, producer, {
        acc: orders,
        current: await action(previous + 1)
      });
    }
    return consumer(1, producer, { acc: orders, current: previous + 1 });
  } else if (type === 2) {
    return console.log('Producer stops sending.');
  }
}

async function consumer(type, producer, payload) {
  if (type === 0) {
    console.log('Consumer ready.');
    return producer(1, consumer, 'Start sending!');
  } else if (type === 1) {
    const { acc, current } = payload;
    const orders = acc.concat(current).slice(-3);
    await wait(1);
    console.log(`Consumer received: ${current}`);
    if (current > 19) {
      console.log('Stop sending...');
      return producer(2);
    } else if (current % 3 === 0) {
      console.log('Consumer requests action...');
      const action = (value) =>
        new Promise((resolve) => {
          const rand = Math.max(Math.random() * 6000, 3000) + 1000;
          console.log(`Action: wait for ${rand}ms`);
          setTimeout(() => {
            resolve(value);
          }, rand);
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

producer(0, consumer);
