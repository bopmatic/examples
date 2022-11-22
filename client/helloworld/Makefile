OPENAPIGENJS=java -jar ./openapi-generator-cli.jar generate -g typescript-axios -o src/openapi --git-host github.com --git-user-id bopmatic --git-repo-id examples/helloworld/openapi --additional-properties=supportsES6=true,npmVersion=6.9.0,typescriptThreePlus=true

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

src/pb/greeter.swagger.json: src/pb/greeter.proto
	protoc -I ./ --openapiv2_out=./ --openapiv2_opt=simple_operation_ids=true,generate_unbound_methods=true ./src/pb/greeter.proto

# @todo need to generalize this rather than hardcode Orders & dependency
src/pb/HelloWorld.bopmatic.json: src/pb/greeter.swagger.json
	jq '{"host":"api.helloworld.bopmatic.com"} + .' $< | jq '{"schemes":["https"]} + .' > src/pb/HelloWorld.bopmatic.json > $@

public/apitest/bopmatic.swagger.json: src/pb/HelloWorld.bopmatic.json
	cp src/pb/HelloWorld.bopmatic.json public/apitest/bopmatic.swagger.json

openapi-generator-cli.jar:
	curl -L https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/6.2.0/openapi-generator-cli-6.2.0.jar --output openapi-generator-cli.jar

node_modules: package.json
	npm install

src/openapi: openapi-generator-cli.jar src/pb/HelloWorld.bopmatic.json
	$(OPENAPIGENJS) -i ./src/pb/HelloWorld.bopmatic.json

.PHONY: clean
clean:
	rm -rf src/pb/greeter.swagger.json src/pb/HelloWorld.bopmatic.json src/openapi build public/apitest/bopmatic.swagger.json

FORCE:
