build: order site_assets/apitest/bopmatic.swagger.json
	mkdir -p build/pb
	cp -a pb/*.js build/pb
	cp -a order_server.js build
	cp -a node_modules build
	cp -a runorders.sh build

.PHONY: order
order: pb/order_pb.js
	npm install

pb/order_pb.js: pb/order.proto
	grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./ --grpc_out=grpc_js:./ pb/order.proto

pb/order.swagger.json: pb/order.proto
	protoc -I ./ --openapiv2_out=./ --openapiv2_opt=simple_operation_ids=true,generate_unbound_methods=true $<

pb/orders.bopmatic.json: pb/order.swagger.json
	jq '{"host":"api.orders.bopmatic.com"} + .' $< | jq '{"schemes":["https"]} + .' > pb/orders.bopmatic.json > $@

site_assets/apitest/bopmatic.swagger.json: site_assets pb/orders.bopmatic.json
	cp pb/orders.bopmatic.json site_assets/apitest/bopmatic.swagger.json

site_assets: FORCE
	test -d client && diff -q pb/order.proto client/src/pb/order.proto || printf ""
	test -d client && cd client && make build || printf ""
	test -d client && rm -rf site_assets || printf ""
	test -d client && cp -a client/build site_assets || printf ""
	test -d client || mkdir -p site_assets/apitest

.PHONY: clean
clean:
	rm -rf pb/order_pb.js pb/order_grpc_pb.js pb/orders.bopmatic.json pb/order.swagger.json site_assets/apitest/bopmatic.swagger.json build site_assets

FORCE:
