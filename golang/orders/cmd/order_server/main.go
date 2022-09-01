package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"math/rand"
	"net"
	"strconv"
	"time"

	pb "github.com/bopmatic/examples/golang/orders/pb"
	"google.golang.org/grpc"

	"google.golang.org/protobuf/encoding/protojson"

	dapr "github.com/dapr/go-sdk/client"
)

var (
	// default port here should match what you've defined in Bopmatic.yaml
	port       = flag.Int("port", 26001, "The server port")
	daprClient dapr.Client
)

const (
	// table name is of the format <database>.<table> where database and
	// table are what you've defined in your Bopmatic.yaml
	ordersTable = "Customers.OrderTable"
)

type server struct {
	pb.UnimplementedMyOrderServiceServer
}

func (s *server) PlaceOrder(ctx context.Context, in *pb.PlaceOrderRequest) (*pb.PlaceOrderReply, error) {

	log.Printf("PlaceOrder: new order customerId:%v item:%v cost:%v",
		in.Desc.GetCustomerId(), in.Desc.GetItemDescription(),
		in.Desc.GetItemCost())

	orderId := rand.Uint64()
	order := &pb.Order{
		TimestampInNanos: uint64(time.Now().UnixNano()),
		Desc:             in.GetDesc(),
	}
	orderEncoded, err := protojson.Marshal(order)
	if err != nil {
		return nil, fmt.Errorf("Failed to encode order for customerId:%v item:%v cost:%v err:%v",
			in.Desc.GetCustomerId(), in.Desc.GetItemDescription(),
			in.Desc.GetItemCost(), err)
	}

	err = daprClient.SaveState(ctx, ordersTable, strconv.FormatUint(orderId,
		16), orderEncoded, nil)

	if err != nil {
		return nil, fmt.Errorf("Failed to record order for customerId:%v item:%v cost:%v err:%v",
			in.Desc.GetCustomerId(), in.Desc.GetItemDescription(),
			in.Desc.GetItemCost(), err)
	}

	reply := &pb.PlaceOrderReply{
		OrderId:          orderId,
		TimestampInNanos: order.TimestampInNanos,
	}

	return reply, nil
}

func (s *server) GetOrder(ctx context.Context, in *pb.GetOrderRequest) (*pb.GetOrderReply, error) {

	orderId := in.GetOrderId()
	log.Printf("GetOrder: lookup up orderId:%v", orderId)

	result, err := daprClient.GetState(ctx, ordersTable, strconv.FormatUint(orderId,
		16), nil)
	if err != nil {
		return nil, fmt.Errorf("Failed to retrieve orderId:%v: %v", orderId, err)
	}

	var order pb.Order
	err = protojson.Unmarshal(result.Value, &order)
	if err != nil {
		return nil, fmt.Errorf("Failed to decode order for orderId:%v: %v",
			orderId, err)
	}

	reply := &pb.GetOrderReply{
		Order: &order,
	}

	return reply, nil
}

func main() {
	rand.Seed(time.Now().UnixNano())

	var err error
	daprClient, err = dapr.NewClient()
	if err != nil {
		log.Fatalf("failed to initialize dapr client: %v", err)
	}
	defer daprClient.Close()

	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterMyOrderServiceServer(s, &server{})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
