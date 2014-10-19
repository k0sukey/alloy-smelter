## alloy-smelter

Helper commands for Appcelerator Titanium MVC Framework Alloy project app.

### Why alloy-smelter?

I frequently the controller on move, rename and remove.

### Installation

```sh
$ [sudo] npm install -g alloy-smelter
```

Installing edge version.

```sh
[sudo] npm install -g git://github.com/k0sukey/alloy-smelter.git
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

#### generate

Pass to Alloy generate command(controller, view, style).

```sh
$ smelter generate controller foo
$ smelter generate view bar
$ smelter generate style baz
```

##### --template option

Using custom template option.
Please prepare a template in ```process.env.HOME/.smelter/template/someWindow/controller.js, view.xml, style.tss```.

```sh
$ smelter generate controller foo -T someWindow
$ smelter generate view bar -T someWindow
$ smelter generate style baz -T someWindow
```

#### copy

Bulk copy for controller, view and style files.

```sh
$ smelter copy foo bar
$ smelter copy foo bar/baz
```

#### move

Bulk move or rename for controller, view and style files.

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

Avoid Alloy compile in Titanium build.
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

#### install

Bulk install titanium, alloy cli and Titanium SDK.

```sh
$ smelter install
```

#### clean

Removes previous build and **Resources** directories.

```sh
$ smelter clean
```

#### stats

Statistics a Alloy project.

```sh
$ smelter stats

┌──────────────────┬─────────────────────────────────────┐
│ Project files    │                    controllers:   1 │
│                  │                          views:   3 │
│                  │                         styles:   1 │
│                  │                         models:   1 │
├──────────────────┼─────────────────────────────────────┤
│ View nodes       │                          Label:   8 │
│                  │                      TextField:   4 │
│                  │                         Window:   3 │
│                  │                       MenuItem:   3 │
│                  │                           View:   3 │
│                  │                     HeaderView:   2 │
│                  │                       ListView:   2 │
│                  │                      Templates:   2 │
│                  │                   ItemTemplate:   2 │
│                  │                    ListSection:   2 │
│                  │                       ListItem:   2 │
│                  │                           Menu:   1 │
│                  │               NavigationWindow:   1 │
│                  │                      TabbedBar:   1 │
│                  │                         Labels:   1 │
├──────────────────┼─────────────────────────────────────┤
│ Style selectors  │                        element:   9 │
│                  │                             id:   7 │
│                  │                          class:   2 │
├──────────────────┼─────────────────────────────────────┤
│ Using properties │                          title:   8 │
│                  │                         height:   7 │
│                  │                          width:   6 │
│                  │                         bottom:   6 │
│                  │                           left:   5 │
│                  │                         todoId:   4 │
│                  │                          color:   4 │
│                  │                            top:   4 │
│                  │                         bindId:   4 │
│                  │                          right:   3 │
│                  │                backgroundColor:   3 │
│                  │                       template:   2 │
│                  │                       hintText:   2 │
│                  │                           name:   2 │
│                  │            defaultItemTemplate:   2 │
│                  │                          value:   2 │
│                  │                              x:   2 │
│                  │                              y:   2 │
│                  │            windowSoftInputMode:   1 │
│                  │             backgroundGradient:   1 │
│                  │                           type:   1 │
│                  │                     startPoint:   1 │
│                  │                    exitOnClose:   1 │
│                  │                          index:   1 │
│                  │                       endPoint:   1 │
│                  │                         colors:   1 │
│                  │                   paddingRight:   1 │
│                  │                 selectionStyle:   1 │
│                  │                      textAlign:   1 │
│                  │                  verticalAlign:   1 │
│                  │                       editable:   1 │
│                  │                 separatorColor:   1 │
├──────────────────┼─────────────────────────────────────┤
│ Unique colors    │                         {done}:   2 │
│                  │                           #fff:   1 │
│                  │                        #fcfcfc:   1 │
│                  │                        #bcbac1:   1 │
│                  │                        #f6f6f6:   1 │
│                  │                           #333:   1 │
│                  │                        #d9d9d9:   1 │
├──────────────────┼─────────────────────────────────────┤
│ Event type       │                          click:   8 │
│                  │                       dblclick:   2 │
│                  │                          swipe:   2 │
│                  │                         return:   2 │
├──────────────────┼─────────────────────────────────────┤
│ Event listener   │                    doToggleall:   2 │
│                  │                       doToggle:   2 │
│                  │                         doEdit:   2 │
│                  │                       doDelete:   2 │
│                  │                       doEdited:   2 │
│                  │                          doAll:   1 │
│                  │                       doActive:   1 │
│                  │                    doCompleted:   1 │
│                  │                          doTab:   1 │
├──────────────────┼─────────────────────────────────────┤
│ Data binding     │                 dataCollection:   2 │
│                  │                  dataTransform:   2 │
│                  │                     dataFilter:   2 │
└──────────────────┴─────────────────────────────────────┘
```

### License

The MIT License (MIT) Copyright (c) 2014 Kosuke Isobe