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

.PHONY: deps
deps: $(PROTO_ALL_GENERATED_SRCS)
	rm -rf go.mod go.sum vendor
	go mod init mybopmaticproj
	GOPROXY=direct go mod tidy -compat=1.17
	go mod vendor

pb/%.pb.go pb/%_grpc.pb.go pb/%.swagger.json: pb/%.proto
	protoc -I ./ --go_out ./ --go_opt paths=source_relative --go-grpc_out ./ --go-grpc_opt paths=source_relative --openapiv2_out=./ --openapiv2_opt=simple_operation_ids=true,generate_unbound_methods=true $<

# @todo need to generalize this rather than hardcode Orders & dependency
pb/Orders.bopmatic.json: pb/order.swagger.json
	jq '{"host":"api.orders.bopmatic.com"} + .' $< | jq '{"schemes":["https"]} + .' > pb/Orders.bopmatic.json > $@

site_assets/apitest/bopmatic.swagger.json: pb/Orders.bopmatic.json
	cp $< $@

define SERVICE_RULE
$(1): $(PROTO_ALL_GENERATED_SRCS) FORCE
	go build $(GOMODULE)/cmd/$(1)
endef
$(foreach s,$(SERVICES),$(eval $(call SERVICE_RULE,$(s))))

.PHONY: clean
clean:
	rm -rf $(PROTO_ALL_GENERATED_SRCS) $(SERVICES) pb/Orders.bopmatic.json site_assets/apitest/bopmatic.swagger.json

FORCE:
