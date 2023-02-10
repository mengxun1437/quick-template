# quick-template
my own quick template

## Install
- `npm install @mengxun1437/q-template -g`

## How to Use?
You should to set your own git storage of your templates, every template should be stored on each branch, the branch's name is same as the template's name

And then, you can use the command like this to set your git config
```shell
qt config git.type -u <your plat name e.g. github>

qt config git.origin -u <your host name, e.g. https://github.com>

qt config git.owner -u <your user name e.g. mengxun1437>

qt config git.name -u <your repository's name e.g. quick-template>
```


After that, you can use the command like this to set the templates you have
```shell
qt config templates -a <the name of branch your used to store template e.g. nodejs>

# change the -a to -d, then you can delete the template
```

You can also opt like this to set some global props
```shell
qt config globalProps -a <global props e.g. projectName/projectDescription>

qt config handleFiles -a <handle files e.g. package.json/README.md>

the cli will find the path from handleFiles and then find the globalProps in these files to replace them

```

NOTE: You should set global props like this 👇

```json
{
  "name": "${projectName}",
  "version": "1.0.0",
  "description": "${projectDescription}",
}
```
this will be transformed to
```json
{
  "name": "<projectName>",
  "version": "1.0.0",
  "description": "<projectDescription>",
}
```

At last, you can use like `qt config git.name` to check your config


## Usage

`qt init` is a quick command for you to choice the template of your own, incase every time you create a new project with complex options


