build: greeter site_assets/apitest/bopmatic.swagger.json
	mkdir -p build/pb
	cp -a pb/*.js build/pb
	cp -a greeter_server.js build
	cp -a node_modules build
	cp -a rungreeter.sh build

.PHONY: greeter
greeter: pb/greeter_pb.js
	npm install

pb/greeter_pb.js: pb/greeter.proto
	grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./ --grpc_out=grpc_js:./ pb/greeter.proto

pb/greeter.swagger.json: pb/greeter.proto
	protoc -I ./ --openapiv2_out=./ --openapiv2_opt=simple_operation_ids=true,generate_unbound_methods=true $<

pb/helloworld.bopmatic.json: pb/greeter.swagger.json
	jq '{"host":"api.helloworld.bopmatic.com"} + .' $< | jq '{"schemes":["https"]} + .' > pb/helloworld.bopmatic.json > $@

site_assets/apitest/bopmatic.swagger.json: site_assets pb/helloworld.bopmatic.json
	cp pb/helloworld.bopmatic.json site_assets/apitest/bopmatic.swagger.json

site_assets: FORCE
	test -d client && diff -q pb/greeter.proto client/src/pb/greeter.proto || printf ""
	test -d client && cd client && make build || printf ""
	test -d client && rm -rf site_assets || printf ""
	test -d client && cp -a client/build site_assets || printf ""
	test -d client || mkdir -p site_assets/apitest

.PHONY: clean
clean:
	rm -rf pb/greeter_pb.js pb/greeter_grpc_pb.js pb/helloworld.bopmatic.json pb/greeter.swagger.json site_assets/apitest/bopmatic.swagger.json build site_assets

FORCE:
