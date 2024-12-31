var grpc = require('@grpc/grpc-js');
var dapr = require("@dapr/dapr");
var messages = require('./pb/order_pb');
var services = require('./pb/order_grpc_pb');

const serverHost = "127.0.0.1";
const serverPort = "50051";
const client = new dapr.DaprClient({ serverHost, serverPort, communicationProtocol: dapr.CommunicationProtocolEnum.GRPC });
const ordersTable = "Customers.OrderTable"

async function placeOrder(call, callback) {
  let orderId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  let orderDetail = call.request.getDesc();
  let custId = orderDetail.getCustomerid()
  let itemCost = orderDetail.getItemcost();
  let itemDesc = orderDetail.getItemdescription();

  console.log('placeOrder: start: id:' + orderId + ' order{customerId:' + custId + ', item:' + itemDesc + ', cost:' + itemCost + '}');

  const orderTs = Date.now() * 1e6
  const orderData = {
    key: orderId.toString(),
    value: {
      orderId: orderId.toString(),
      desc: {
        customerId: custId,
        itemCost: itemCost,
        itemDescription: itemDesc,
        orderTs: orderTs
      }
    }
  };
  const metadata = { };

  try {
    await client.state.save(ordersTable, [orderData], metadata);
    let reply = new messages.PlaceOrderReply();
    reply.setOrderid(orderId);
    reply.setTimestampinnanos(orderTs);
    callback(null, reply);
  } catch(err) {
    console.error('Error saving order:', err);
    callback(err);
  }
}

async function getOrder(call, callback) {
  console.log('getOrder: start: id:' + call.request.getOrderid());

  try {
    orderValue = await client.state.get(ordersTable, call.request.getOrderid().toString())
    if (orderValue && orderValue.desc) {
      let orderDetails = new messages.OrderDetails();
      orderDetails.setCustomerid(orderValue.desc.customerId);
      orderDetails.setItemcost(orderValue.desc.itemCost);
      orderDetails.setItemdescription(orderValue.desc.itemDescription);
      let order = new messages.Order();
      order.setTimestampinnanos(orderValue.desc.orderTs);
      order.setDesc(orderDetails);
      let reply = new messages.GetOrderReply();
      reply.setOrder(order);
      console.log('getOrder: complete: id:' + call.request.getOrderid());
      callback(null, reply);
    } else {
      console.error('getOrder: could not find order');
      callback(new Error('Order not found'), null);
    }
  } catch(err) {
    console.error('Error retrieving order:', err);
    callback(err);
  }
}

function main() {
  var server = new grpc.Server();
  server.addService(services.MyOrderServiceService, {placeOrder: placeOrder, getOrder: getOrder});
  server.bindAsync('127.0.0.1:26001', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) {
      return console.error(err);
    }
    console.log(`gRPC listening on ${port}`)
  });
}

main();
