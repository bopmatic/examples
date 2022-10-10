package com.bopmatic.orders;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.stub.StreamObserver;
import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ThreadLocalRandom;
import java.util.logging.Logger;
import io.dapr.client.DaprClient;
import io.dapr.client.DaprClientBuilder;
import io.dapr.client.domain.State;
import reactor.core.publisher.Mono;
import com.google.protobuf.util.JsonFormat;
import com.google.protobuf.InvalidProtocolBufferException;
import java.lang.String;

/**
 * Server that manages startup/shutdown of a {@code MyOrderService} server.
 */
public class MyOrderServiceServer {
  private static final Logger logger = Logger.getLogger(MyOrderServiceServer.class.getName());

  private Server server;

  public class EncodingException extends RuntimeException {
    public EncodingException(String errorMessage, Throwable err) {
      super(errorMessage, err);
    }
  }

  private void start() throws IOException {
    DaprClient daprClient = new DaprClientBuilder().build();

    /* The port on which the server should run; this should match the port in Bopmatic.yaml */
    int port = 26001;
    server = ServerBuilder.forPort(port)
        .addService(new MyOrderServiceImpl(daprClient))
        .build()
        .start();
    logger.info("Server started, listening on " + port);
    Runtime.getRuntime().addShutdownHook(new Thread() {
      @Override
      public void run() {
        // Use stderr here since the logger may have been reset by its JVM shutdown hook.
        System.err.println("*** shutting down gRPC server since JVM is shutting down");
        try {
          MyOrderServiceServer.this.stop();
        } catch (InterruptedException e) {
          e.printStackTrace(System.err);
        }
        System.err.println("*** server shut down");
      }
    });
  }

  private void stop() throws InterruptedException {
    if (server != null) {
      server.shutdown().awaitTermination(30, TimeUnit.SECONDS);
    }
  }

  /**
   * Await termination on the main thread since the grpc library uses daemon threads.
   */
  private void blockUntilShutdown() throws InterruptedException {
    if (server != null) {
      server.awaitTermination();
    }
  }

  /**
   * Main launches the server from the command line.
   */
  public static void main(String[] args) throws IOException, InterruptedException {
    final MyOrderServiceServer server = new MyOrderServiceServer();
    server.start();
    server.blockUntilShutdown();
  }

  public MyOrderServiceImpl newImpl(DaprClient daprClientIn) {
      return new MyOrderServiceImpl(daprClientIn);
  }        

  class MyOrderServiceImpl extends MyOrderServiceGrpc.MyOrderServiceImplBase {
    public DaprClient daprClient;
    public final String OrdersTable = "Customers.OrderTable";

    MyOrderServiceImpl(DaprClient daprClientIn) {
        daprClient = daprClientIn;
    }

    @Override
    public void placeOrder(PlaceOrderRequest req, StreamObserver<PlaceOrderReply> responseObserver) {

      long orderId = ThreadLocalRandom.current().nextLong();
      // annoyingly Java doesn't appear to have nanosecond precision?
      long orderTimeInNanos = System.currentTimeMillis() * 1000000;

      Order order = Order.newBuilder().setTimestampInNanos(orderTimeInNanos).setDesc(req.getDesc()).build();
      try {
          String orderEncoded = JsonFormat.printer().print(order);

          // cannot use order directly due to some internal dapr serialization problem:
          //   io.dapr.exceptions.DaprException: INTERNAL: failed saving state in state store Customers.OrderTable: SerializationException: malformed input around byte 129 
          daprClient.saveState(OrdersTable, Long.toHexString(orderId), orderEncoded).block();

          PlaceOrderReply reply = PlaceOrderReply.newBuilder().setOrderId(orderId).setTimestampInNanos(orderTimeInNanos).build();

          responseObserver.onNext(reply);
          responseObserver.onCompleted();
      } catch (InvalidProtocolBufferException e) {
          throw new EncodingException("Failed to encode order:" + Long.toHexString(orderId), e);
      }
    }

    @Override
    public void getOrder(GetOrderRequest req, StreamObserver<GetOrderReply> responseObserver) {

      String orderIdStr = Long.toHexString(req.getOrderId());

      Mono<State<String>> orderMono = daprClient.getState(OrdersTable, orderIdStr, java.lang.String.class);
      String orderEncoded = orderMono.block().getValue();
      Order.Builder orderBuilder = Order.newBuilder();
      try {
          JsonFormat.parser().merge(orderEncoded, orderBuilder);
          Order order = orderBuilder.build();

          GetOrderReply reply = GetOrderReply.newBuilder().setOrder(order).build();

          responseObserver.onNext(reply);
          responseObserver.onCompleted();
      } catch (InvalidProtocolBufferException e) {
          throw new EncodingException("Failed to decode order:" + orderIdStr, e);
      }
    }
  }
}
