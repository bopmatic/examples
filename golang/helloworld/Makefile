SERVICE_PATHS = $(wildcard cmd/*)
SERVICES = $(patsubst cmd/%,%,$(SERVICE_PATHS))
PROTO_DEFS = $(wildcard pb/*.proto)
PROTO_GENERATED_SRCS = $(PROTO_DEFS:.proto=.pb.go)
PROTO_GENERATED_GRPC_SRCS = $(PROTO_DEFS:.proto=_grpc.pb.go)
PROTO_ALL_GENERATED_SRCS = $(PROTO_GENERATED_SRCS) $(PROTO_GENERATED_GRPC_SRCS)
GOMODULE = $(shell go mod edit -json go.mod | jq -r  .Module.Path)

.PHONY: build
build: $(SERVICES)

go.sum vendor: go.mod $(PROTO_ALL_GENERATED_SRCS)
	go mod vendor

pb/%.pb.go %_grpc.pb.go: pb/%.proto
	protoc -I ./ --go_out ./ --go_opt paths=source_relative --go-grpc_out ./ --go-grpc_opt paths=source_relative $<

define SERVICE_RULE
$(1): vendor $(PROTO_ALL_GENERATED_SRCS) FORCE
	go build $(GOMODULE)/cmd/$(1)
endef
$(foreach s,$(SERVICES),$(eval $(call SERVICE_RULE,$(s))))

.PHONY: clean
clean:
	rm -rf go.sum vendor $(PROTO_ALL_GENERATED_SRCS) $(SERVICES)

FORCE:
