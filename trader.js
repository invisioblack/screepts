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
                      .value()
                      .price;
      console.log(bestPrice, resourceType);
    }
  }

}
