"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.getIdentifier = exports.createControllerSave = exports.createControllerRemove = exports.createControllerLoad = exports.createControllerImports = exports.createControllerGetAll = exports.createControllerGet = exports.createControllerExist = exports.createControllerConstructor = exports.createControllerAddProtected = exports.createControllerAdd = void 0;
//Imports
var samara_1 = require("samara");
var sys = require("samara");
//Functions
function createControllerAdd(source) {
    var sc = new samara_1.SourceObject();
    sc.add("add(" + source.controller_object.toLowerCase() + ":" + source.object_name + "):void{", 1);
    sc.add("this." + source.controller_array + ".push(" + source.controller_object.toLowerCase() + ");", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerAdd = createControllerAdd;
function createControllerAddProtected(source) {
    var sc = new samara_1.SourceObject();
    sc.add("addProtected(" + source.controller_object.toLowerCase() + ":" + source.object_name + "):void{", 1);
    sc.add("if(!this.exist(" + source.controller_object.toLowerCase() + "." + getIdentifier(source.attributes).name + ")){", 2);
    sc.add("this.add(" + source.controller_object.toLowerCase() + ");", 3);
    sc.add("}", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerAddProtected = createControllerAddProtected;
function createControllerConstructor(source) {
    var sc = new samara_1.SourceObject();
    sc.add("//Constructor", 1);
    sc.add("constructor(){", 1);
    if (!sys.isNull(source.controller_extends)) {
        sc.add("super();", 2);
    }
    sc.add("this." + source.controller_array + " = [];", 2);
    sc.add("this.load();", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerConstructor = createControllerConstructor;
function createControllerExist(source) {
    var sc = new samara_1.SourceObject();
    var identifier = getIdentifier(source.attributes);
    sc.add("exist(" + identifier.name + ":" + identifier.type + "):Boolean{", 1);
    sc.add("return this.get(" + identifier.name + ") !== undefined;", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerExist = createControllerExist;
function createControllerGet(source) {
    var sc = new samara_1.SourceObject();
    var identifier = getIdentifier(source.attributes);
    sc.add("get(" + identifier.name + ":" + identifier.type + "):" + source.object_name + "{", 1);
    sc.add("for(let " + source.controller_object.toLowerCase() + " of this." + source.controller_array + "){", 2);
    sc.add("if(" + source.controller_object.toLowerCase() + "." + identifier.name + " === " + identifier.name + "){", 3);
    sc.add("return " + source.controller_object.toLowerCase() + ";", 4);
    sc.add("}", 3);
    sc.add("}", 2);
    sc.add("return undefined;", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerGet = createControllerGet;
function createControllerGetAll(source) {
    var sc = new samara_1.SourceObject();
    sc.add("getAll():" + source.object_name + "[]" + "{", 1);
    sc.add("return this." + source.array + ";", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerGetAll = createControllerGetAll;
function createControllerImports(source) {
    var sc = new samara_1.SourceObject();
    sc.add("//Imports", 0);
    sc.add("import * as data from \"" + source.json + "\";", 0);
    sc.add("import {" + source.object_name + "} from \"" + source.object_file.replace(".ts", "") + "\";", 0);
    sc.add("import * as func from \"./functions\";", 0);
    return sc.getString();
}
exports.createControllerImports = createControllerImports;
function createControllerLoad(source) {
    var sc = new samara_1.SourceObject();
    sc.add("load():void{", 1);
    sc.add("for(let " + source.controller_object.toLowerCase() + " of data." + source.array + "){", 2);
    var paras = "";
    var count = 0;
    for (var _i = 0, _a = source.attributes; _i < _a.length; _i++) {
        var attribute = _a[_i];
        count > 0 ? paras += ", " : undefined;
        paras += source.controller_object.toLowerCase() + "." + attribute.name;
        count++;
    }
    sc.add("let object:" + source.object_name + " = new " + source.object_name + "(" + paras + ");", 3);
    sc.add("this." + source.controller_array + ".push(object);", 3);
    sc.add("}", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerLoad = createControllerLoad;
function createControllerRemove(source) {
    var sc = new samara_1.SourceObject();
    var identifier = getIdentifier(source.attributes);
    sc.add("remove(" + identifier.name + ":" + identifier.type + "):Boolean{", 1);
    sc.add("for(let i=0; i<this." + source.array + ".length; i++){", 2);
    sc.add("if(this." + source.array + "[i]." + identifier.name + " === " + identifier.name + "){", 3);
    sc.add("this." + source.array + ".splice(i, 1);", 4);
    sc.add("return true;", 4);
    sc.add("}", 3);
    sc.add("}", 2);
    sc.add("return false;", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerRemove = createControllerRemove;
function createControllerSave(source) {
    var sc = new samara_1.SourceObject();
    sc.add("save(){", 1);
    //sc.add("for(let " + source.controller_object.toLowerCase() + " of this." + source.controller_array + "){", 2);
    sc.add("let json:string = JSON.stringify(this." + source.controller_array + ");", 2);
    sc.add("func.writeFile(\"" + source.json + "\", json);", 2);
    //TODO: All
    //sc.add("}", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerSave = createControllerSave;
function getIdentifier(attributes) {
    for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
        var att = attributes_1[_i];
        if (att.identifier) {
            return {
                name: att.name,
                type: att.type
            };
        }
    }
    return undefined;
}
exports.getIdentifier = getIdentifier;
function writeFile(path, content) {
    sys.writeFile(path, content);
}
exports.writeFile = writeFile;
//# sourceMappingURL=functions.js.map