/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var messages = require('./pb/greeter_pb');
var services = require('./pb/greeter_grpc_pb');

var grpc = require('@grpc/grpc-js');

function sayHello(call, callback) {
  console.log('sayHello: request from ' + call.request.getName());
  var reply = new messages.HelloReply();
  reply.setMessage('Hello from Bopmatic nodejs, ' + call.request.getName());
  callback(null, reply);
}

function main() {
  var server = new grpc.Server();
  server.addService(services.GreeterService, {sayHello: sayHello});
  server.bindAsync('127.0.0.1:26001', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) {
      return console.error(err);
    }
    console.log(`gRPC listening on ${port}`)
  });
}

main();
