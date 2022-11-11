OPENAPIGENJS=java -jar ./openapi-generator-cli.jar generate -g typescript-axios -o src/openapi --git-host github.com --git-user-id bopmatic --git-repo-id examples/orders/openapi --additional-properties=supportsES6=true,npmVersion=6.9.0,typescriptThreePlus=true

build: src/openapi public/apitest/bopmatic.swagger.json node_modules FORCE
	ionic build

.PHONY: deps
deps: src/openapi
	rm -rf openapi-generator-cli.jar
	rm -rf node_modules

# protoc-gen-openapiv2 install via:
# GOFLAGS='' go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest

# jq install:
# sudo apt install jq

src/pb/order.swagger.json: src/pb/order.proto
	protoc -I ./ --openapiv2_out=./ --openapiv2_opt=simple_operation_ids=true,generate_unbound_methods=true ./src/pb/order.proto

# @todo need to generalize this rather than hardcode Orders & dependency
src/pb/Orders.bopmatic.json: src/pb/order.swagger.json
	jq '{"host":"api.orders.bopmatic.com"} + .' $< | jq '{"schemes":["https"]} + .' > src/pb/Orders.bopmatic.json > $@

public/apitest/bopmatic.swagger.json: src/pb/Orders.bopmatic.json
	cp src/pb/Orders.bopmatic.json public/apitest/bopmatic.swagger.json

openapi-generator-cli.jar:
	curl -L https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/6.2.0/openapi-generator-cli-6.2.0.jar --output openapi-generator-cli.jar

node_modules: package.json
	npm install

src/openapi: openapi-generator-cli.jar src/pb/Orders.bopmatic.json
	$(OPENAPIGENJS) -i ./src/pb/Orders.bopmatic.json

.PHONY: clean
clean:
	rm -rf src/pb/order.swagger.json src/pb/Orders.bopmatic.json src/openapi build public/apitest/bopmatic.swagger.json

FORCE:
