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

vendor: go.mod $(PROTO_ALL_GENERATED_SRCS)
	go mod download
	go mod vendor

pb/%.pb.go pb/%_grpc.pb.go pb/%.swagger.json: pb/%.proto
	protoc -I ./ --go_out ./ --go_opt paths=source_relative --go-grpc_out ./ --go-grpc_opt paths=source_relative --openapiv2_out=./ --openapiv2_opt=simple_operation_ids=true,generate_unbound_methods=true $<

# @todo need to generalize this rather than hardcode HelloWorld & dependency
pb/HelloWorld.bopmatic.json: pb/greeter.swagger.json
	jq '{"host":"api.helloworld.bopmatic.com"} + .' $< | jq '{"schemes":["https"]} + .' > pb/HelloWorld.bopmatic.json > $@

site_assets/apitest/bopmatic.swagger.json: site_assets pb/HelloWorld.bopmatic.json
	cp pb/HelloWorld.bopmatic.json site_assets/apitest/bopmatic.swagger.json

site_assets: FORCE
	test -d client && diff -q pb/greeter.proto client/src/pb/greeter.proto || printf ""
	test -d client && cd client && make build || printf ""
	test -d client && rm -rf site_assets || printf ""
	test -d client && cp -a client/build site_assets || printf ""

define SERVICE_RULE
$(1): vendor $(PROTO_ALL_GENERATED_SRCS) FORCE
	go build $(GOMODULE)/cmd/$(1)
endef
$(foreach s,$(SERVICES),$(eval $(call SERVICE_RULE,$(s))))

.PHONY: deps
deps: $(PROTO_ALL_GENERATED_SRCS)
	rm -rf go.mod go.sum vendor
	go mod init mybopmaticproj
	GOPROXY=direct go mod tidy -compat=1.17
	go mod vendor

.PHONY: clean
clean:
	rm -rf $(PROTO_ALL_GENERATED_SRCS) $(SERVICES) pb/HelloWorld.bopmatic.json site_assets/apitest/bopmatic.swagger.json

FORCE:
