"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = exports.getIdentifiersParasAndStats = exports.getIdentifiers = exports.createObjectDeclarations = exports.createObjectConstructor = exports.createControllerSave = exports.createControllerRemove = exports.createControllerLoad = exports.createControllerImports = exports.createControllerGetAll = exports.createControllerGet = exports.createControllerExist = exports.createControllerConstructor = exports.createControllerConstants = exports.createControllerAddProtected = exports.createControllerAdd = void 0;
//Imports
var samara_1 = require("samara");
var sys = require("samara");
//Functions
function createControllerAdd(source) {
    var sc = new samara_1.SourceObject();
    sc.add("add(" + source.controller_object.toLowerCase() + ":" + source.object_name + "):void{", 1);
    sc.add("this." + source.array + ".push(" + source.controller_object.toLowerCase() + ");", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerAdd = createControllerAdd;
function createControllerAddProtected(source) {
    var sc = new samara_1.SourceObject();
    sc.add("addProtected(" + source.controller_object.toLowerCase() + ":" + source.object_name + "):void{", 1);
    var ids = getIdentifiers(source.attributes);
    var stats = "";
    for (var i = 0; i < ids.length; i++) {
        stats += source.controller_object.toLowerCase() + "." + ids[i].name;
        i < ids.length - 1 ? stats += ", " : undefined;
    }
    sc.add("if(!this.exist(" + stats + ")){", 2);
    sc.add("this.add(" + source.controller_object.toLowerCase() + ");", 3);
    sc.add("}", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerAddProtected = createControllerAddProtected;
function createControllerConstants() {
    var sc = new samara_1.SourceObject();
    sc.add("//Constants", 0);
    sc.add("const fs = require(\"fs\");", 0);
    return sc.getString();
}
exports.createControllerConstants = createControllerConstants;
function createControllerConstructor(source) {
    var sc = new samara_1.SourceObject();
    sc.add("//Constructor", 1);
    sc.add("constructor(){", 1);
    if (!sys.isNull(source.controller_extends)) {
        sc.add("super();", 2);
    }
    sc.add("this." + source.array + " = [];", 2);
    sc.add("this.load();", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerConstructor = createControllerConstructor;
function createControllerExist(source) {
    var sc = new samara_1.SourceObject();
    var parasAndStats = getIdentifiersParasAndStats(source, "");
    sc.add("exist(" + parasAndStats.paras + "):Boolean{", 1);
    sc.add("return this.get(" + parasAndStats.names + ") !== undefined;", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerExist = createControllerExist;
function createControllerGet(source) {
    var sc = new samara_1.SourceObject();
    var parasAndStats = getIdentifiersParasAndStats(source, source.controller_object.toLowerCase());
    sc.add("get(" + parasAndStats.paras + "):" + source.object_name + "{", 1);
    sc.add("for(let " + source.controller_object.toLowerCase() + " of this." + source.array + "){", 2);
    sc.add("if(" + parasAndStats.stats + "){", 3);
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
    var file_controller = source.file_controller;
    var sc = new samara_1.SourceObject();
    sc.add("//Imports", 0);
    var file_json = source.file_json;
    file_json = createControllerImportsPath(file_controller, file_json);
    sc.add("import * as data from \"" + file_json + "\";", 0);
    if (!sys.isNull(source.controller_object_import)) {
        sc.add("import " + source.controller_object_import + ";", 0);
    }
    else {
        var file_object = source.file_object;
        file_object = createControllerImportsPath(file_controller, file_object).replace(".ts", "");
        sc.add("import {" + source.object_name + "} from \"" + file_object + "\";", 0);
    }
    return sc.getString();
}
exports.createControllerImports = createControllerImports;
function createControllerImportsPath(path_src, path_tgt) {
    var src = path_src.split("/");
    var tgt = path_tgt.split("/");
    while (src[0] === tgt[0]) {
        src.shift();
        tgt.shift();
    }
    path_tgt = "";
    if (src.length < 2) {
        path_tgt = "./";
    }
    else {
        for (var i = 0; i < src.length - 1; i++) {
            path_tgt += "../";
        }
    }
    var count = 0;
    for (var i = 0; i < tgt.length; i++) {
        i > 0 ? path_tgt += "/" : undefined;
        path_tgt += tgt[i];
    }
    return path_tgt;
}
function createControllerLoad(source) {
    var sc = new samara_1.SourceObject();
    sc.add("load():void{", 1);
    sc.add("for(let " + source.controller_object.toLowerCase() + " of data." + source.array + "){", 2);
    var paras = "";
    var count = 0;
    for (var _i = 0, _a = source.attributes; _i < _a.length; _i++) {
        var attribute = _a[_i];
        if (attribute.initialize) {
            count > 0 ? paras += ", " : undefined;
            paras += source.controller_object.toLowerCase() + "." + attribute.name;
            count++;
        }
    }
    sc.add("let object:" + source.object_name + " = new " + source.object_name + "(" + paras + ");", 3);
    sc.add("this." + source.array + ".push(object);", 3);
    sc.add("}", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerLoad = createControllerLoad;
function createControllerRemove(source) {
    var sc = new samara_1.SourceObject();
    var ids = getIdentifiers(source.attributes);
    var parasAndStats = getIdentifiersParasAndStats(source, "this." + source.array + "[i]");
    sc.add("remove(" + parasAndStats.paras + "):Boolean{", 1);
    sc.add("for(let i=0; i<this." + source.array + ".length; i++){", 2);
    sc.add("if(" + parasAndStats.stats + "){", 3);
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
    //let content:string = "{\"" + source.array + "\":" + JSON.stringify(this.people) + "}";
    sc.add("let content:string = \"{\\\"\"" + source.array + "\\\":}", 2);
    //sc.add("content = content.replace(\"\\\"_\", \"\\\"\");", 2);
    sc.add("fs.writeFile(\"" + source.file_json + "\", content, err => {", 2);
    sc.add("if(err){", 3);
    sc.add("console.error(err);", 4);
    sc.add("}", 3);
    sc.add("});", 2);
    //sc.add("}", 2);
    sc.add("}", 1);
    return sc.getString();
}
exports.createControllerSave = createControllerSave;
function createObjectConstructor(source) {
    var sc = new samara_1.SourceObject();
    sc.add("//Constructor", 1);
    var con = "constructor(";
    var count = 0;
    for (var _i = 0, _a = source.attributes; _i < _a.length; _i++) {
        var att = _a[_i];
        if (att.initialize) {
            count > 0 ? con += ", " : undefined;
            con += att.name + ":" + att.type;
            count++;
        }
    }
    con += "){";
    sc.add(con, 1);
    for (var _b = 0, _c = source.attributes; _b < _c.length; _b++) {
        var att = _c[_b];
        if (att.initialize) {
            sc.add("this." + att.name + " = " + att.name + ";", 2);
        }
    }
    sc.add("}", 1);
    return sc.getString();
}
exports.createObjectConstructor = createObjectConstructor;
function createObjectDeclarations(source) {
    var sc = new samara_1.SourceObject();
    sc.add("//Declarations", 1);
    for (var _i = 0, _a = source.attributes; _i < _a.length; _i++) {
        var att = _a[_i];
        if (att.type === "array") {
            att.type = "any[]";
            sc.add(att.name + ":" + att.type + " = [];", 1);
        }
        else {
            sc.add(att.name + ":" + att.type + ";", 1);
        }
    }
    return sc.getString();
}
exports.createObjectDeclarations = createObjectDeclarations;
/*export function createObjectGetMethods(source):string{
    let sc:SourceObject = new SourceObject();
    sc.add("//Get-Methods", 1);
    for(let i = 0; i < source.attributes.length; i++){
        sc.add("get " + source.attributes[i].name + "():" + source.attributes[i].type + "{", 1);
        sc.add("return this._" + source.attributes[i].name + ";", 2);
        sc.add("}", 1);
        i < source.attributes.length - 1 ? sc.newLine() : undefined;
    }
    return sc.getString();
}

export function createObjectSetMethods(source):string{
    let sc:SourceObject = new SourceObject();
    sc.add("//Set-Methods", 1);
    for(let i = 0; i < source.attributes.length; i++){
        sc.add("set " + source.attributes[i].name + "(value:" + source.attributes[i].type + "){", 1);
        sc.add("this._" + source.attributes[i].name + " = value;", 2);
        sc.add("}", 1);
        i < source.attributes.length - 1 ? sc.newLine() : undefined;
    }
    return sc.getString();
}*/
function getIdentifiers(attributes) {
    var ids = [];
    for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
        var att = attributes_1[_i];
        if (att.identifier) {
            var object = {
                name: att.name,
                type: att.type
            };
            ids.push(object);
        }
    }
    return ids;
}
exports.getIdentifiers = getIdentifiers;
function getIdentifiersParasAndStats(source, stats_begin) {
    var ids = getIdentifiers(source.attributes);
    var paras = "";
    var stats = "";
    var names = "";
    for (var i = 0; i < ids.length; i++) {
        paras += ids[i].name + ":" + ids[i].type;
        stats += stats_begin + "." + ids[i].name + " === " + ids[i].name;
        names += ids[i].name;
        if (i < ids.length - 1) {
            paras += ", ";
            stats += " && ";
            names += ", ";
        }
    }
    return {
        paras: paras,
        stats: stats,
        names: names
    };
}
exports.getIdentifiersParasAndStats = getIdentifiersParasAndStats;
function writeFile(path, content) {
    sys.writeFile(path, content);
}
exports.writeFile = writeFile;
//# sourceMappingURL=functions.js.map