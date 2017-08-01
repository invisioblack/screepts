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
    
  }
}
