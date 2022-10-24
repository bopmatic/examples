.PHONY: build
build: build/install site_assets/apitest/bopmatic.swagger.json

build/install: FORCE
	./gradlew instDist

src/main/proto/greeter.swagger.json: src/main/proto/greeter.proto
	protoc -I ./ --openapiv2_out=./ --openapiv2_opt=simple_operation_ids=true,generate_unbound_methods=true,Msrc/main/proto/greeter.proto=github.com/bopmatic/examples/java/helloworld/pb $<

src/main/proto/greeter.bopmatic.json: src/main/proto/greeter.swagger.json
	jq '{"host":"api.helloworld.bopmatic.com"} + .' $< | jq '{"schemes":["https"]} + .' > $@

site_assets/apitest/bopmatic.swagger.json: site_assets src/main/proto/greeter.bopmatic.json
	cp src/main/proto/greeter.bopmatic.json site_assets/apitest/bopmatic.swagger.json

site_assets: FORCE
	test -d client && diff -q src/main/proto/greeter.proto client/src/pb/greeter.proto || printf ""
	test -d client && cd client && make build || printf ""
	test -d client && rm -rf site_assets || printf ""
	test -d client && cp -a client/build site_assets || printf ""

.PHONY: clean
clean:
	rm -rf build .gradle site_assets/apitest/bopmatic.swagger.json src/main/proto/greeter.bopmatic.json src/main/proto/greeter.swagger.json

.PHONY: test
test:
	./gradlew test

FORCE:
