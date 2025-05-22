#!/usr/bin/python3

import asyncio
import logging
import time
import random
import grpc

from dapr.clients import DaprClient
from dapr.clients.grpc._state import StateItem
from google.protobuf.json_format import Parse
from google.protobuf.json_format import MessageToJson

import pb.order_pb2
import pb.order_pb2_grpc

class Order(pb.order_pb2_grpc.MyOrderServiceServicer):
    daprClient = None
    # table name is of the format <database>.<table> where database and
    # table are what you've defined in your Bopmatic.yaml
    ordersTable = "Orders.prod.Customers.OrderTable"

    def __init__(self, daprClientIn):
        self.daprClient = daprClientIn

    async def PlaceOrder(
            self, request: pb.order_pb2.PlaceOrderRequest,
            context: grpc.aio.ServicerContext) -> pb.order_pb2.PlaceOrderReply:

        myOrderId = random.getrandbits(64)
        logging.info("PlaceOrder: start: id:%s order{customerId:%s, item:%s, cost:%s}",	myOrderId, request.desc.customerId, request.desc.itemDescription, request.desc.itemCost)
        order = pb.order_pb2.Order(desc = request.desc)
        order.timestampInNanos = time.time_ns()
        orderEncoded = MessageToJson(order)
        self.daprClient.save_state(store_name=self.ordersTable, key=format(myOrderId, 'x'), value=orderEncoded)
        logging.info("PlaceOrder: complete: id:%s", myOrderId)
        return pb.order_pb2.PlaceOrderReply(orderId=myOrderId, timestampInNanos=order.timestampInNanos)

    async def GetOrder(
            self, request: pb.order_pb2.GetOrderRequest,
            context: grpc.aio.ServicerContext) -> pb.order_pb2.GetOrderReply:

        logging.info("GetOrder: start: id:%s", request.orderId)
        state = self.daprClient.get_state(store_name=self.ordersTable, key=format(request.orderId, 'x'))
        myOrder = Parse(state.data, pb.order_pb2.Order())
        logging.info("GetOrder: complete: id:%s", request.orderId)
        return pb.order_pb2.GetOrderReply(order=myOrder)

async def serve() -> None:
    server = grpc.aio.server()
    random.seed(time.time_ns())
    try:
        with DaprClient() as myDaprClient:
            pb.order_pb2_grpc.add_MyOrderServiceServicer_to_server(Order(myDaprClient), server)
            listen_addr = '[::]:26001'
            server.add_insecure_port(listen_addr)
            logging.info("Starting server on %s", listen_addr)
            await server.start()
            await server.wait_for_termination()
    except Exception as e:
        print("Failed to open dapr client: ", e)

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    asyncio.run(serve())
