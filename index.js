"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSources = void 0;
//Imports
var sys = require("samara");
var samara_1 = require("samara");
//Class
var DataSources = /** @class */ (function () {
    //Constructor
    function DataSources(path) {
        this.path = path;
    }
    //Methods
    DataSources.createFileJSON = function (source) {
        var json = new samara_1.JSONObject();
        json.addName(source.array);
        json.openArray();
        json.closeArray();
        sys.writeFile(source.json, json.getString());
    };
    DataSources.createFileController = function (source) {
        var sc = new samara_1.SourceObject();
        sc.add("//Imports", 0);
        sc.add("import * as " + source.array + " from \"./" + source.json + "\";", 0);
        sc.add("import {" + source.object_name + "} from \"./" + source.object_file.replace(".ts", "") + "\";", 0);
        sc.newLine();
        sc.add("//Class", 0);
        var ext = "";
        if (!sys.isNull(source.controller_extends)) {
            ext = " extends " + source.controller_extends;
        }
        sc.add("export class " + source.controller_name + ext + "{", 0);
        sc.add("//Declarations", 1);
        sc.add("private " + source.controller_array + ":" + source.object_name + "[];", 1);
        sc.newLine();
        sc.add("//Constructor", 1);
        sc.add("constructor(){", 1);
        sc.add("this." + source.controller_array + " = [];", 2);
        sc.add("}", 1);
        sc.newLine();
        sc.add("//Methods", 1);
        sc.add("add(" + source.controller_object.toLowerCase() + ":" + source.object_name + "):void{", 1);
        sc.add("this." + source.controller_array + ".push(" + source.controller_object.toLowerCase() + ");", 2);
        sc.add("}", 1);
        sc.newLine();
        var id = this.getIdentifier(source.attributes);
        sc.add("addProtected(" + source.controller_object.toLowerCase() + ":" + source.object_name + "):void{", 1);
        sc.add("if(!this.exist(" + source.controller_object.toLowerCase() + "." + id + ")){", 2);
        sc.add("this.add(" + source.controller_object.toLowerCase() + ");", 3);
        sc.add("}", 2);
        sc.add("}", 1);
        sc.newLine();
        sc.add("exist(" + id + ":string):Boolean{", 1);
        sc.add("return this.get(" + id + ") !== undefined;", 2);
        sc.add("}", 1);
        sc.newLine();
        sc.add("get(" + id + ":string):" + source.object_name + "{", 1);
        sc.add("for(let " + source.controller_object.toLowerCase() + " of this." + source.controller_array + "){", 2);
        sc.add("if(" + source.controller_object.toLowerCase() + "." + id + " === " + id + "){", 3);
        sc.add("return " + source.controller_object.toLowerCase() + ";", 4);
        sc.add("}", 3);
        sc.add("}", 2);
        sc.add("return undefined;", 2);
        sc.add("}", 1);
        sc.newLine();
        sc.add("}", 0);
        sys.writeFile(source.controller_file, sc.getString());
    };
    DataSources.createFileObject = function (source) {
        var sc = new samara_1.SourceObject();
        sc.add("//Imports", 0);
        sc.add("import * as " + source.array + " from \"./" + source.json + "\";", 0);
        sc.newLine();
        sc.add("//Class", 0);
        var ext = "";
        if (!sys.isNull(source.object_extends)) {
            ext = " extends " + source.object_extends;
        }
        sc.add("export class " + source.object_name + ext + "{", 0);
        sc.add("//Declarations", 1);
        for (var _i = 0, _a = source.attributes; _i < _a.length; _i++) {
            var att = _a[_i];
            sc.add("private _" + att.name + ":" + att.type + ";", 1);
        }
        sc.newLine();
        sc.add("//Constructor", 1);
        var con = "constructor(";
        var count = 0;
        for (var _b = 0, _c = source.attributes; _b < _c.length; _b++) {
            var att = _c[_b];
            if (att.initialize) {
                count > 0 ? con += ", " : undefined;
                con += att.name + ":" + att.type;
                count++;
            }
        }
        con += "){";
        sc.add(con, 1);
        for (var _d = 0, _e = source.attributes; _d < _e.length; _d++) {
            var att = _e[_d];
            if (att.initialize) {
                sc.add("this." + att.name + " = " + att.name + ";", 2);
            }
        }
        sc.add("}", 1);
        sc.newLine();
        sc.add("//Get-Methods", 1);
        for (var _f = 0, _g = source.attributes; _f < _g.length; _f++) {
            var att = _g[_f];
            sc.add("get " + att.name + "():" + att.type + "{", 1);
            sc.add("return this._" + att.name + ";", 2);
            sc.add("}", 1);
            sc.newLine();
        }
        sc.add("//Set-Methods", 1);
        for (var _h = 0, _j = source.attributes; _h < _j.length; _h++) {
            var att = _j[_h];
            sc.add("set " + att.name + "(value:" + att.type + "){", 1);
            sc.add("this._" + att.name + " = value;", 2);
            sc.add("}", 1);
            sc.newLine();
        }
        sc.add("}", 0);
        sys.writeFile(source.object_file, sc.getString());
    };
    DataSources.prototype.generateSource = function () {
        if (this.parseJSON()) {
            console.log("VALID SOURCE");
            for (var _i = 0, _a = this.json.sources; _i < _a.length; _i++) {
                var source = _a[_i];
                console.log("Name: " + source.name);
                DataSources.createFileJSON(source);
                DataSources.createFileObject(source);
                DataSources.createFileController(source);
            }
            return true;
        }
        return false;
    };
    DataSources.getIdentifier = function (attributes) {
        for (var _i = 0, attributes_1 = attributes; _i < attributes_1.length; _i++) {
            var att = attributes_1[_i];
            if (att.identifier) {
                return att.name;
            }
        }
        return undefined;
    };
    DataSources.prototype.parseJSON = function () {
        try {
            this.json = JSON.parse(sys.readFile(this.path));
            if (this.json.sources === undefined) {
                return false;
            }
            else {
                return true;
            }
        }
        catch (e) {
            return false;
        }
    };
    return DataSources;
}());
exports.DataSources = DataSources;
//# sourceMappingURL=index.js.map