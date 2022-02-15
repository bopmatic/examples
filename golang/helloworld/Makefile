SERVICE_PATHS = $(wildcard cmd/*)
SERVICES = $(patsubst cmd/%,%,$(SERVICE_PATHS))
PROTO_DEFS = $(wildcard pb/*.proto)
PROTO_GENERATED_SRCS = $(PROTO_DEFS:.proto=.pb.go)
PROTO_GENERATED_GRPC_SRCS = $(PROTO_DEFS:.proto=_grpc.pb.go)
PROTO_GENERATED_SWAGGER_SRCS = $(PROTO_DEFS:.proto=.swagger.json)
PROTO_ALL_GENERATED_SRCS = $(PROTO_GENERATED_SRCS) $(PROTO_GENERATED_GRPC_SRCS) $(PROTO_GENERATED_SWAGGER_SRCS)
GOMODULE = $(shell go mod edit -json go.mod | jq -r  .Module.Path)

.PHONY: build
build: $(SERVICES) site_assets/apitest/bopmatic.swagger.json

go.sum vendor: go.mod $(PROTO_ALL_GENERATED_SRCS)
	go mod vendor

pb/%.pb.go pb/%_grpc.pb.go pb/%.swagger.json: pb/%.proto
	protoc -I ./ --go_out ./ --go_opt paths=source_relative --go-grpc_out ./ --go-grpc_opt paths=source_relative --openapiv2_out=./ --openapiv2_opt=simple_operation_ids=true,generate_unbound_methods=true $<

# @todo need to generalize this rather than hardcode HelloWorld & dependency
pb/HelloWorld.bopmatic.json: pb/greeter.swagger.json
	jq '{"host":"api.helloworld.bopmatic.com"} + .' $< | jq '{"schemes":["https"]} + .' > pb/HelloWorld.bopmatic.json > $@

site_assets/apitest/bopmatic.swagger.json: pb/HelloWorld.bopmatic.json
	cp $< $@

define SERVICE_RULE
$(1): vendor $(PROTO_ALL_GENERATED_SRCS) FORCE
	go build $(GOMODULE)/cmd/$(1)
endef
$(foreach s,$(SERVICES),$(eval $(call SERVICE_RULE,$(s))))

.PHONY: clean
clean:
	rm -rf go.sum vendor $(PROTO_ALL_GENERATED_SRCS) $(SERVICES) pb/HelloWorld.bopmatic.json site_assets/apitest/bopmatic.swagger.json

FORCE:
