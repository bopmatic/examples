.PHONY: build
build:
	cd golang/helloworld; make build
	cd golang/orders; make build
	cd java/helloworld; make build
	cd python/helloworld; make build
	cd client/orders; make build

.PHONY: clean
clean:
	cd golang/helloworld; make clean
	cd golang/orders; make clean
	cd java/helloworld; make clean
	cd python/helloworld; make clean
	cd client/orders; make clean

FORCE:
