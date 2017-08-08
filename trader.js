trader = {};

trader.createSellOrdersAll = room => {
  if (room.terminal) {
    let orders = Game.market.getAllOrders();
    for(let resourceType in room.terminal.store) {
      if (resourceType == RESOURCE_ENERGY) {
        continue;
      }
      let bestPrice = _(orders)
                      .filter({type: ORDER_SELL, resourceType: resourceType})
                      .sortBy('price')
                      .head()
                      .price;
      let result = Game.market.createOrder(
        ORDER_SELL,
        resourceType,
        bestPrice,
        room.terminal.store[resourceType],
        room.name
      );
    }
  }
}

trader.sellAll = room => {
  if (room.terminal) {
    let orders = Game.market.getAllOrders();
    for(let resourceType in room.terminal.store) {
      if (resourceType == RESOURCE_ENERGY) {
        continue;
      }
      let bestOffer = _(orders)
                      .filter({type: ORDER_BUY, resourceType: resourceType})
                      .filter(order => Game.market.calcTransactionCost(order.amount, order.roomName, room.name) <= room.terminal.store[RESOURCE_ENERGY])
                      .sortBy('price')
                      .last();
      if (bestOffer) {
        let cost = Game.market.calcTransactionCost(bestOffer.amount, bestOffer.roomName, room.name);
        let sellAmount = Math.min(room.terminal.store[resourceType], bestOffer.amount)
        let result = Game.market.deal(
          bestOffer.id,
          sellAmount,
          room.name
        );

        if (result == OK) {
          console.log('Sold resources using' + cost + 'energy.' +
                      '\n Resource type: ' +
                      resourceType +
                      '\n Amount: ' +
                      sellAmount +
                      '\n Price: ' +
                      bestOffer.price +
                      '\n Room: ' +
                      bestOffer.roomName);
        }
      }
    }
  }
}
