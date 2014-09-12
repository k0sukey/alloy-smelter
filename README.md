## alloy-smelter

Helper commands for Appcelerator Titanium MVC Framework Alloy project app.

### why?

I frequently the controller on move, rename and remove.

### Installation

```
$ [sudo] npm install -g alloy-smelter
```

### Usage

```
$ smelter <command> [options]
```

#### help

Display usage information.

```
$ smelter --help
```

#### move

Bulk move(rename) for controller, view and style files.

```
$ smelter move foo bar
$ smelter move foo bar/baz
```

#### remove

Bulk remove for controller, view and style files.

```
$ smelter remove foo
$ smelter remove bar/baz
```

#### build

Pass to Titanium build command.

```
$ smelter build -t '-p ios --retina --tall'
```

##### --no-complie option

Avoid alloy compile in titanium build.
Temporarily remove the ```ti.alloy``` plugin.
Please describe yourself to ```tiapp.xml``` in ```<plugin>ti.alloy</plugin>```, If it does not return.

```
$ smelter build -t '-p ios --retina --tall' --no-compile
```

#### clean

Removes previous build and **Resources** directories.

```
$ smelter clean
```

#### stats

Statistics a alloy project(*yet files count only*).

```
$ smelter stats
```

### License

The MIT License (MIT) Copyright (c) 2014 Kosuke Isobe