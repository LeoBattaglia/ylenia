"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSources = void 0;
//Imports
var func = require("./functions");
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
        var attributes = [];
        for (var _i = 0, _a = source.attributes; _i < _a.length; _i++) {
            var att = _a[_i];
            attributes.push({ name: att.name, type: att.type });
        }
        for (var i = 0; i < source.defaults.length; i++) {
            json.openObject();
            for (var o = 0; o < source.attributes.length; o++) {
                if (attributes[o].type.toLowerCase() === "array") {
                    json.addName(attributes[o].name);
                    json.add("[]");
                    o < source.attributes.length - 1 ? json.add(",") : undefined;
                }
                else {
                    var isString = attributes[o].type === "string";
                    var setComma = o < source.attributes.length - 1;
                    json.addValue(attributes[o].name, source.defaults[i][o], isString, setComma);
                }
            }
            json.closeObject();
            i < source.defaults.length - 1 ? json.add(",") : undefined;
        }
        json.closeArray();
        sys.writeFile(source.file_json, json.getString());
    };
    DataSources.createFileController = function (source) {
        var sc = new samara_1.SourceObject();
        sc.add(func.createControllerImports(source), 0);
        sc.add(func.createControllerConstants(), 0);
        sc.add("//Class", 0);
        var ext = "";
        if (!sys.isNull(source.controller_extends)) {
            ext = " extends " + source.controller_extends;
        }
        sc.add("export class " + source.controller_name + ext + "{", 0);
        sc.add("//Declarations", 1);
        sc.add("private readonly " + source.array + ":" + source.object_name + "[];", 1);
        sc.newLine();
        sc.add(func.createControllerConstructor(source), 0);
        sc.add("//Methods", 1);
        sc.add(func.createControllerAdd(source), 0);
        sc.add(func.createControllerAddProtected(source), 0);
        sc.add(func.createControllerExist(source), 0);
        sc.add(func.createControllerGet(source), 0);
        sc.add(func.createControllerGetAll(source), 0);
        sc.add(func.createControllerLoad(source), 0);
        sc.add(func.createControllerRemove(source), 0);
        sc.add(func.createControllerSave(source), 0);
        sc.add("}", 0);
        sys.writeFile(source.file_controller, sc.getString());
    };
    DataSources.createFileObject = function (source) {
        var sc = new samara_1.SourceObject();
        sc.add("//Class", 0);
        var ext = "";
        if (!sys.isNull(source.object_extends)) {
            ext = " extends " + source.object_extends;
        }
        sc.add("export class " + source.object_name + ext + "{", 0);
        sc.add(func.createObjectDeclarations(source), 0);
        sc.add(func.createObjectConstructor(source), 0);
        //sc.add(func.createObjectGetMethods(source), 0);
        //sc.add(func.createObjectSetMethods(source), 0);
        sc.add("}", 0);
        sys.writeFile(source.file_object, sc.getString());
    };
    DataSources.prototype.generateSources = function () {
        if (this.parseJSON()) {
            for (var _i = 0, _a = this.json.sources; _i < _a.length; _i++) {
                var source = _a[_i];
                DataSources.createFileJSON(source);
                DataSources.createFileObject(source);
                DataSources.createFileController(source);
            }
            return true;
        }
        return false;
    };
    DataSources.prototype.parseJSON = function () {
        try {
            this.json = JSON.parse(sys.readFile(this.path));
            return this.json.sources !== undefined;
        }
        catch (e) {
            return false;
        }
    };
    return DataSources;
}());
exports.DataSources = DataSources;
//# sourceMappingURL=index.js.map