# Bopmatic Examples

The Bopmatic Examples repository is a collection of public domain
Bopmatic projects showing how to use the service. Anyone is free to
copy/paste/modify any of the examples to use in their own projects.

## Building

bopmatic build <project>

## Installing

Any of the examples here can be installed via the [Bopmatic CLI](https://github.com/bopmatic/cli). e.g.:

```bash
$ bopmatic new
Available project templates:
        golang/helloworld
        golang/orders
        java/helloworld
        java/orders
        python/helloworld
        python/orders
        staticsite
Enter Bopmatic Project Template [golang/helloworld]: 
Enter Bopmatic Project Name [someuserhelloworld]: someuserhelloworld
Successfully created ./someuserhelloworld:
Project:
        Format: 1.0
        Name: someuserhelloworld
        SiteAssets: site_assets
        BuildCmd: make
        Root: someuserhelloworld
        Description: Hello World Bopmatic Example Project
        Services: 1
        Service[0]:
                Name: Greeter
                Description: Service for greeting customers
                ApiDef: pb/greeter.proto
                UserAccess: anon_public
                Port: 26001
                Executable: greeter_server
                Rpcs: 1
                Rpc[0]: SayHello
        Databases: 0
        UserGroups: 0

To build your new project next run:
        'cd someuserhelloworld; bopmatic package build'
```

## Usage

N/A

## Contributing
Pull requests are welcome at https://github.com/bopmatic/examples

For major changes, please open an issue first to discuss what you
would like to change.

## License
[UNLICENSE](https://unlicense.org)
