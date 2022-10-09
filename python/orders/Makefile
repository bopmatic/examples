PROTO_DEFS = $(wildcard pb/*.proto)
PROTO_GENERATED_SRCS = $(PROTO_DEFS:.proto=_pb2.py)
PROTO_GENERATED_GRPC_SRCS = $(PROTO_DEFS:.proto=_pb2_grpc.py)
PROTO_GENERATED_SWAGGER_SRCS = $(PROTO_DEFS:.proto=.swagger.json)
PROTO_ALL_GENERATED_SRCS = $(PROTO_GENERATED_SRCS) $(PROTO_GENERATED_GRPC_SRCS) $(PROTO_GENERATED_SWAGGER_SRCS)

build: $(PROTO_ALL_GENERATED_SRCS) site_assets/apitest/bopmatic.swagger.json deps
	pyinstaller -y ./order_server.py

pb/%_pb2.py pb/%_pb2_grpc.py: pb/%.proto
	python3 -m grpc_tools.protoc -I./ --python_out=./ --grpc_python_out=./ $<

# @todo need to generalize this rather than hardcode Orders & dependency
pb/order.swagger.json: pb/order.proto
	protoc -I ./ --openapiv2_out=./ --openapiv2_opt=simple_operation_ids=true,generate_unbound_methods=true,Mpb/order.proto=github.com/bopmatic/examples/python/orders/pb $<

pb/Orders.bopmatic.json: pb/order.swagger.json
	jq '{"host":"api.orders.bopmatic.com"} + .' $< | jq '{"schemes":["https"]} + .' > pb/Orders.bopmatic.json > $@

site_assets/apitest/bopmatic.swagger.json: pb/Orders.bopmatic.json
	cp $< $@

.PHONY: deps
deps:
	pip3 install grpcio grpcio-tools pyinstaller dapr

.PHONY: clean
clean:
	rm -rf $(PROTO_ALL_GENERATED_SRCS) pb/Orders.bopmatic.json site_assets/apitest/bopmatic.swagger.json dist build order_server.spec pb/__pycache__

FORCE:
