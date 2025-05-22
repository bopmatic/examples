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

	pb "mybopmaticproj/pb"

	"google.golang.org/grpc"

	"google.golang.org/protobuf/encoding/protojson"

	"github.com/bopmatic/sdk/golang/util"
	dapr "github.com/dapr/go-sdk/client"
)

var (
	// default port here should match what you've defined in Bopmatic.yaml
	port       = flag.Int("port", 26001, "The server port")
	daprClient dapr.Client
)

const (
	// table name is of the format <project>.prod.<database>.<table> where
	// project, database, and table are what you've defined in your
	// project's Bopmatic.yaml
	ordersTable = "Orders.prod.Customers.OrderTable"
)

type server struct {
	pb.UnimplementedMyOrderServiceServer
}

func (s *server) PlaceOrder(ctx context.Context,
	in *pb.PlaceOrderRequest) (*pb.PlaceOrderReply, error) {

	orderId := rand.Uint64()

	log.Printf("PlaceOrder: start: id:%v order{customerId:%v, item:%v, cost:%v}",
		orderId, in.Desc.GetCustomerId(), in.Desc.GetItemDescription(),
		in.Desc.GetItemCost())

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

	log.Printf("PlaceOrder: complete: id:%v", orderId)

	return reply, nil
}

func (s *server) GetOrder(ctx context.Context,
	in *pb.GetOrderRequest) (*pb.GetOrderReply, error) {

	orderId := in.GetOrderId()
	log.Printf("GetOrder: start: id:%v", orderId)

	result, err := daprClient.GetState(ctx, ordersTable,
		strconv.FormatUint(orderId, 16), nil)
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

	log.Printf("GetOrder: complete: id:%v", orderId)

	return reply, nil
}

func main() {
	log.SetFlags(log.Flags() &^ (log.Ldate | log.Ltime))
	rand.Seed(time.Now().UnixNano())

	var err error
	daprClient, err = util.NewDaprClient(context.Background())
	if err != nil {
		log.Fatalf("failed to init dapr client: %v", err)
	}
	defer daprClient.Close()

	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterMyOrderServiceServer(s, &server{})

	log.Printf("server listening at port %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
