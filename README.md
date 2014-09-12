## alloy-smelter

Helper commands for Appcelerator Titanium MVC Framework Alloy project app.

### why alloy-smelter?

I frequently the controller on move, rename and remove.

### Installation

```sh
$ [sudo] npm install -g alloy-smelter
```

### Usage

```sh
$ smelter <command> [options]
```

#### help

Display usage information.

```sh
$ smelter --help
```

#### move

Bulk move(rename) for controller, view and style files.

```sh
$ smelter move foo bar
$ smelter move foo bar/baz
```

#### remove

Bulk remove for controller, view and style files.

```sh
$ smelter remove foo
$ smelter remove bar/baz
```

#### build

Pass to Titanium build command.

```sh
$ smelter build
$ smelter build iPhone5
$ smelter build -t '-p ios --retina --tall'
```

##### --no-complie option

Avoid alloy compile in titanium build.
Temporarily remove the ```ti.alloy``` plugin.
Please describe yourself to ```tiapp.xml``` in ```<plugin>ti.alloy</plugin>```, If it does not return.

```sh
$ smelter build --no-compile
$ smelter build iPhone5 --no-compile
$ smelter build -t '-p ios --retina --tall' --no-compile
```

#### preset

Launch $EDITOR preset json file.
Preset option using for build command.

```sh
$ smelter preset
```

##### default preset

```json
{
	"iPhone5": "-p ios -Y iphone --retina --tall",
	"iPhone4": "-p ios -Y iphone --retina",
	"iPad": "-p ios -Y ipad --retina --tall"
}
```

#### clean

Removes previous build and **Resources** directories.

```sh
$ smelter clean
```

#### stats

Statistics a alloy project(*yet files count only*).

```sh
$ smelter stats
```

### License

The MIT License (MIT) Copyright (c) 2014 Kosuke Isobe