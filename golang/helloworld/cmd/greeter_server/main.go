package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"net"

	pb "mybopmaticproj/pb"

	"google.golang.org/grpc"
)

var (
	// default port here should match what you've defined in Bopmatic.yaml
	port = flag.Int("port", 26001, "The server port")
)

type server struct {
	pb.UnimplementedGreeterServer
}

func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	log.Printf("SayHello: Received: %v", in.GetName())
	return &pb.HelloReply{Message: "Hello from Bopmatic " + in.GetName() + "!"}, nil
}

func main() {
	flag.Parse()
	lis, err := net.Listen("tcp", fmt.Sprintf("localhost:%d", *port))
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	pb.RegisterGreeterServer(s, &server{})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
