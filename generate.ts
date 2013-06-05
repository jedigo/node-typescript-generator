/// <reference path="typescript-node-definitions/node.d.ts" />


var moduleName = process.argv[2];
var lib = require(moduleName);

var interfaces:IInterface[] = new IInterface[]();

var output:string = 'module ' + moduleName + ' {\n';
outputMembers(lib, 1);
outputInterfaces(interfaces);
output += '}';

console.log(output);

function outputMembers(obj:any, indent:number):string {

    for (var key in obj) {

        var member = obj[key];
        var type = typeof(member);

        if (type == 'function') {

            if (Object.keys(member.prototype).length > 1) {
                outputClass(key, member, indent)
            }
            else {
                outputFunction(key, member, indent);
            }
        }
        else if (type == 'object') {
            outputObject(key, indent);
            interfaces[interfaces.length] = {name: key, obj: member};
        }
        else {
            outputMember(key, type, indent);
        }

    }

    return output;
}


function outputInterfaces(interfaces:IInterface[]) {
    interfaces.forEach(function (i:IInterface) {
        outputInterface(i.name, i.obj, 1);
    });

}

function outputObject(name:string, indent:number) {
    output += getIndent(indent);
    output += name;
    output += ': I'
    output += capitalise(name);
    output += '\n';
}

function outputInterface(name:string, obj:Object, indent:number) {
    output += getIndent(indent);
    output += 'export interface ';
    output += 'I' + capitalise(name);
    output += ' {\n';

    outputMembers(obj, indent + 1);
    output += getIndent(indent);
    output += '};\n'


}

interface IInterface
{
    name: string;
    obj:Object;
}

function outputMember(name:string, type:string, indent:number) {
    output += getIndent(indent);
    if (indent == 1)
        output += 'export var ';
    output += name;
    output += ': '
    output += type;
    output += ';\n';
}

function outputClass(name:string, func:Function, indent:number) {
    output += getIndent(indent);
    output += 'export class ';
    output += name;
    output += ' {\n';


    outputConstructor(func, indent + 1);

    outputMembers(func.prototype, indent + 1);
    output += getIndent(indent);
    output += '};\n'

}


function outputConstructor(func:Function, indent:number) {

    output += getIndent(indent);
    output += 'constructor';
    output += getArgs(func);
    output += ';\n'
}


function outputFunction(name:string, func:Function, indent:number) {


    output += getIndent(indent);
    if (indent == 1)
        output += 'export function ';
    output += name;

    output += getArgs(func);
    output += ';\n'
}

function getArgs(func:Function):string {
    var s = func.toString();

    var re = new RegExp('\\(.*?\\)');
    return s.match(re).toString();

}


function getIndent(indent:number):string {
    var retval:string = '    ';
    for (var i = 1; i < indent; ++i) {
        retval += '    ';
    }
    return retval;
}

function capitalise(str:string) {
    return str[0].toUpperCase() + str.substr(1);

}