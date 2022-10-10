package com.bopmatic.orders;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.anyString;

import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import com.bopmatic.orders.MyOrderServiceServer;
import com.bopmatic.orders.MyOrderServiceServer.MyOrderServiceImpl;
import io.grpc.inprocess.InProcessChannelBuilder;
import io.grpc.inprocess.InProcessServerBuilder;
import io.grpc.testing.GrpcCleanupRule;
import com.google.protobuf.util.JsonFormat;
import org.junit.Rule;
import org.junit.Test;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import io.dapr.client.DaprClient;
import io.dapr.client.domain.State;
import reactor.core.publisher.Mono;

@RunWith(MockitoJUnitRunner.class)
public class MyOrderServiceServerTest {
  public final int CustomerId = 123;
  public final String OrderId = "456";
  public final String ItemDesc = "foo";
  public final double ItemCost = 8.88;
  public final double ItemCostEpsilon = 0.01;
  public final int OrderTimestamp = 0;

  /**
   * This rule manages automatic graceful shutdown for the registered servers and channels at the
   * end of test.
   */
  @Rule
  public final GrpcCleanupRule grpcCleanup = new GrpcCleanupRule();

  @Mock
  private DaprClient mockDaprClient;

  @Before
  public void setUp() throws Exception {
      mockDaprClient = mock(DaprClient.class);
  }
    
  /**
   * To test the server, make calls with a real stub using the in-process channel, and verify
   * behaviors or state changes from the client side.
   */
  @Test
  public void myOrderServiceImpl_placeAndGetOrder() throws Exception {
    // Generate a unique in-process server name.
    String serverName = InProcessServerBuilder.generateName();

    assertNotNull(mockDaprClient);

    when(mockDaprClient.saveState(anyString(), anyString(), any(Object.class)))
        .thenReturn(Mono.empty());

    OrderDetails orderDescIn = OrderDetails.newBuilder().setCustomerId(CustomerId).setItemDescription(ItemDesc).setItemCost(ItemCost).build();
    Order orderIn = Order.newBuilder().setTimestampInNanos(OrderTimestamp).setDesc(orderDescIn).build();
    String orderEncodedIn = JsonFormat.printer().print(orderIn);
    
    Mono<State<String>> orderStateMonoIn = Mono.just(new State<String>(OrderId, orderEncodedIn, null, null));

    when(mockDaprClient.getState(anyString(), anyString(), eq(java.lang.String.class))).thenReturn(orderStateMonoIn);

    // Create a server, add service, start, and register for automatic graceful shutdown.
    MyOrderServiceServer orderServiceServer = new MyOrderServiceServer();
    grpcCleanup.register(InProcessServerBuilder
        .forName(serverName).directExecutor().addService(orderServiceServer.newImpl(mockDaprClient)).build().start());

    MyOrderServiceGrpc.MyOrderServiceBlockingStub blockingStub = MyOrderServiceGrpc.newBlockingStub(
        // Create a client channel and register for automatic graceful shutdown.
        grpcCleanup.register(InProcessChannelBuilder.forName(serverName).directExecutor().build()));

    PlaceOrderReply placeOrderReply =
        blockingStub.placeOrder(PlaceOrderRequest.newBuilder().setDesc(orderDescIn).build());

    GetOrderReply getOrderReply =
        blockingStub.getOrder(GetOrderRequest.newBuilder().setOrderId(placeOrderReply.getOrderId()).build());

    Order order = getOrderReply.getOrder();
    OrderDetails returnDesc = order.getDesc();

    assertEquals(CustomerId, returnDesc.getCustomerId());
    assertEquals(ItemDesc, returnDesc.getItemDescription());
    assertTrue(ItemCost - ItemCostEpsilon < returnDesc.getItemCost());
    assertTrue(ItemCost + ItemCostEpsilon > returnDesc.getItemCost());
  }
}
