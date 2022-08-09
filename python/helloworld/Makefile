PROTO_DEFS = $(wildcard pb/*.proto)
PROTO_GENERATED_SRCS = $(PROTO_DEFS:.proto=_pb2.py)
PROTO_GENERATED_GRPC_SRCS = $(PROTO_DEFS:.proto=_pb2_grpc.py)
PROTO_GENERATED_SWAGGER_SRCS = $(PROTO_DEFS:.proto=.swagger.json)
PROTO_ALL_GENERATED_SRCS = $(PROTO_GENERATED_SRCS) $(PROTO_GENERATED_GRPC_SRCS) $(PROTO_GENERATED_SWAGGER_SRCS)

build: $(PROTO_ALL_GENERATED_SRCS) site_assets/apitest/bopmatic.swagger.json
	pyinstaller -y ./greeter_server.py

pb/%_pb2.py pb/%_pb2_grpc.py: pb/%.proto
	python3 -m grpc_tools.protoc -I./ --python_out=./ --grpc_python_out=./ $<

# @todo need to generalize this rather than hardcode HelloWorld & dependency
pb/greeter.swagger.json: pb/greeter.proto
	protoc -I ./ --openapiv2_out=./ --openapiv2_opt=simple_operation_ids=true,generate_unbound_methods=true,Mpb/greeter.proto=github.com/bopmatic/examples/python/helloworld/pb $<

pb/HelloWorld.bopmatic.json: pb/greeter.swagger.json
	jq '{"host":"api.helloworld.bopmatic.com"} + .' $< | jq '{"schemes":["https"]} + .' > pb/HelloWorld.bopmatic.json > $@

site_assets/apitest/bopmatic.swagger.json: pb/HelloWorld.bopmatic.json
	cp $< $@

.PHONY: clean
clean:
	rm -rf $(PROTO_ALL_GENERATED_SRCS) pb/HelloWorld.bopmatic.json site_assets/apitest/bopmatic.swagger.json dist build greeter_server.spec pb/__pycache__

FORCE:
