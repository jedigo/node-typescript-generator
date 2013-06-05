var moduleName = process.argv[2];
var lib = require(moduleName);
var interfaces = new Array();
var output = 'module ' + moduleName + ' {\n';
outputMembers(lib, 1);
outputInterfaces(interfaces);
output += '}';
console.log(output);
function outputMembers(obj, indent) {
    for(var key in obj) {
        var member = obj[key];
        var type = typeof (member);
        if(type == 'function') {
            if(Object.keys(member.prototype).length > 1) {
                outputClass(key, member, indent);
            } else {
                outputFunction(key, member, indent);
            }
        } else if(type == 'object') {
            outputObject(key, indent);
            interfaces[interfaces.length] = {
                name: key,
                obj: member
            };
        } else {
            outputMember(key, type, indent);
        }
    }
    return output;
}
function outputInterfaces(interfaces) {
    interfaces.forEach(function (i) {
        outputInterface(i.name, i.obj, 1);
    });
}
function outputObject(name, indent) {
    output += getIndent(indent);
    output += name;
    output += ': I';
    output += capitalise(name);
    output += '\n';
}
function outputInterface(name, obj, indent) {
    output += getIndent(indent);
    output += 'export interface ';
    output += 'I' + capitalise(name);
    output += ' {\n';
    outputMembers(obj, indent + 1);
    output += getIndent(indent);
    output += '};\n';
}
function outputMember(name, type, indent) {
    output += getIndent(indent);
    if(indent == 1) {
        output += 'export var ';
    }
    output += name;
    output += ': ';
    output += type;
    output += ';\n';
}
function outputClass(name, func, indent) {
    output += getIndent(indent);
    output += 'export class ';
    output += name;
    output += ' {\n';
    outputConstructor(func, indent + 1);
    outputMembers(func.prototype, indent + 1);
    output += getIndent(indent);
    output += '};\n';
}
function outputConstructor(func, indent) {
    output += getIndent(indent);
    output += 'constructor';
    output += getArgs(func);
    output += ';\n';
}
function outputFunction(name, func, indent) {
    output += getIndent(indent);
    if(indent == 1) {
        output += 'export function ';
    }
    output += name;
    output += getArgs(func);
    output += ';\n';
}
function getArgs(func) {
    var s = func.toString();
    var re = new RegExp('\\(.*?\\)');
    return s.match(re).toString();
}
function getIndent(indent) {
    var retval = '    ';
    for(var i = 1; i < indent; ++i) {
        retval += '    ';
    }
    return retval;
}
function capitalise(str) {
    return str[0].toUpperCase() + str.substr(1);
}
//@ sourceMappingURL=generate.js.map
