.PHONY: build
build: build/install site_assets/apitest/bopmatic.swagger.json

build/install: FORCE
	./gradlew instDist

src/main/proto/order.swagger.json: src/main/proto/order.proto
	protoc -I ./ --openapiv2_out=./ --openapiv2_opt=simple_operation_ids=true,generate_unbound_methods=true,Msrc/main/proto/order.proto=github.com/bopmatic/examples/java/order/pb $<

src/main/proto/Orders.bopmatic.json: src/main/proto/order.swagger.json
	jq '{"host":"api.orders.bopmatic.com"} + .' $< | jq '{"schemes":["https"]} + .' > src/main/proto/Orders.bopmatic.json > $@

site_assets/apitest/bopmatic.swagger.json: site_assets src/main/proto/Orders.bopmatic.json
	cp src/main/proto/Orders.bopmatic.json site_assets/apitest/bopmatic.swagger.json

site_assets: FORCE
	test -d client && diff -q pb/order.proto client/src/pb/order.proto || printf ""
	test -d client && cd client && make build || printf ""
	test -d client && rm -rf site_assets || printf ""
	test -d client && cp -a client/build site_assets || printf ""

.PHONY: clean
clean:
	rm -rf build .gradle site_assets/apitest/bopmatic.swagger.json src/main/proto/Orders.bopmatic.json src/main/proto/order.swagger.json

.PHONY: test
test:
	./gradlew test

FORCE:
