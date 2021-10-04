//Imports
import {SourceObject} from "samara";
import * as sys from "samara";

//Functions
export function createControllerAdd(source):string{
    let sc:SourceObject = new SourceObject();
    sc.add("add(" + source.controller_object.toLowerCase() + ":" + source.object_name + "):void{", 1);
    sc.add("this." + source.array + ".push(" + source.controller_object.toLowerCase() + ");", 2);
    sc.add("}", 1);
    return sc.getString();
}

export function createControllerAddProtected(source):string{
    let sc:SourceObject = new SourceObject();
    sc.add("addProtected(" + source.controller_object.toLowerCase() + ":" + source.object_name + "):void{", 1);
    let ids:any[] = getIdentifiers(source.attributes);
    let stats:string = "";
    for(let i = 0; i < ids.length; i++){
        stats += source.controller_object.toLowerCase() + "." + ids[i].name;
        i < ids.length - 1 ? stats += ", " : undefined;
    }
    sc.add("if(!this.exist(" + stats + ")){", 2);
    sc.add("this.add(" + source.controller_object.toLowerCase() + ");", 3);
    sc.add("}", 2);
    sc.add("}", 1);
    return sc.getString();
}

export function createControllerConstants():string{
    let sc:SourceObject = new SourceObject();
    sc.add("//Constants", 0);
    sc.add("const fs = require(\"fs\");", 0);
    return sc.getString();
}

export function createControllerConstructor(source):string{
    let sc:SourceObject = new SourceObject();
    sc.add("//Constructor", 1);
    sc.add("constructor(){", 1);
    if(!sys.isNull(source.controller_extends)){
        sc.add("super();", 2);
    }
    sc.add("this." + source.array + " = [];", 2);
    sc.add("this.load();", 2);
    sc.add("}", 1);
    return sc.getString();
}

export function createControllerExist(source):string{
    let sc:SourceObject = new SourceObject();
    let parasAndStats = getIdentifiersParasAndStats(source, "");
    sc.add("exist(" + parasAndStats.paras + "):Boolean{", 1);
    sc.add("return this.get(" + parasAndStats.names + ") !== undefined;", 2);
    sc.add("}", 1);
    return sc.getString();
}

export function createControllerGet(source):string{
    let sc:SourceObject = new SourceObject();
    let parasAndStats = getIdentifiersParasAndStats(source, source.controller_object.toLowerCase());
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

export function createControllerGetAll(source):string{
    let sc:SourceObject = new SourceObject();
    sc.add("getAll():" + source.object_name + "[]" + "{", 1);
    sc.add("return this." + source.array + ";", 2);
    sc.add("}", 1);
    return sc.getString();
}

export function createControllerImports(source):string{
    let file_controller:string = source.file_controller;
    let file_json:string = source.file_json;
    let file_object:string = source.file_object;
    file_json = createControllerImportsPath(file_controller, file_json);
    file_object = createControllerImportsPath(file_controller, file_object).replace(".ts", "");

    let sc:SourceObject = new SourceObject();
    sc.add("//Imports", 0);
    sc.add("import * as data from \"" + file_json + "\";", 0);
    sc.add("import {" + source.object_name + "} from \"" + file_object + "\";", 0);
    return sc.getString();
}

function createControllerImportsPath(path_src:string, path_tgt:string):string{
    let src:string[] = path_src.split("/");
    let tgt:string[] = path_tgt.split("/");
    while(src[0] === tgt[0]){
        src.shift();
        tgt.shift();
    }
    path_tgt = "";
    if(src.length < 2){
        path_tgt = "./";
    }else{
        for(let i = 0; i < src.length - 1; i++){
            path_tgt += "../";
        }
    }
    let count:number = 0;
    for(let i = 0; i < tgt.length; i++){
        i > 0 ? path_tgt += "/" : undefined;
        path_tgt += tgt[i];
    }
    return path_tgt;
}

export function createControllerLoad(source):string{
    let sc:SourceObject = new SourceObject();
    sc.add("load():void{", 1);
    sc.add("for(let " + source.controller_object.toLowerCase() + " of data." + source.array + "){", 2);
    let paras:string = "";
    let count:number = 0;
    for(let attribute of source.attributes){
        if(attribute.initialize){
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

export function createControllerRemove(source):string{
    let sc:SourceObject = new SourceObject();
    let ids:any[] = getIdentifiers(source.attributes);
    let parasAndStats = getIdentifiersParasAndStats(source, "this." + source.array + "[i]");
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

export function createControllerSave(source):string{
    let sc:SourceObject = new SourceObject();
    sc.add("save(){", 1);
    //sc.add("for(let " + source.controller_object.toLowerCase() + " of this." + source.controller_array + "){", 2);
    sc.add("let content:string = JSON.stringify(this." + source.array + ");", 2);
    //sc.add("func.writeFile(\"" + source.file_json + "\", json);", 2);

    sc.add("fs.writeFile(\"" + source.file_json + "\", content, err => {", 2);
    sc.add("if(err){", 3);
    sc.add("console.error(err);", 4);
    sc.add("}", 3);
    sc.add("});", 2);

    //sc.add("}", 2);
    sc.add("}", 1);
    return sc.getString();
}

export function createObjectConstructor(source):string{
    let sc:SourceObject = new SourceObject();
    sc.add("//Constructor", 1);
    let con:string = "constructor(";
    let count:number = 0;
    for(let att of source.attributes){
        if(att.initialize){
            count > 0 ? con += ", " : undefined;
            con += att.name + ":" + att.type;
            count++;
        }
    }
    con += "){";
    sc.add(con, 1);
    for(let att of source.attributes){
        if(att.initialize){
            sc.add("this." + att.name + " = " + att.name + ";", 2);
        }
    }
    sc.add("}", 1);
    return sc.getString();
}

export function createObjectDeclarations(source):string{
    let sc:SourceObject = new SourceObject();
    sc.add("//Declarations", 1);
    for(let att of source.attributes){
        if(att.type === "array"){
            att.type = "any[]";
            sc.add("private _" + att.name + ":" + att.type + " = [];", 1);
        }else{
            sc.add("private _" + att.name + ":" + att.type + ";", 1);
        }
    }
    return sc.getString();
}

export function createObjectGetMethods(source):string{
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
}

export function getIdentifiers(attributes):any[]{
    let ids:any[] = [];
    for(let att of attributes){
        if(att.identifier){
            let object = {
                name: att.name,
                type: att.type
            };
            ids.push(object);
        }
    }
    return ids;
}

export function getIdentifiersParasAndStats(source, stats_begin:string):any{
    let ids:any[] = getIdentifiers(source.attributes);
    let paras:string = "";
    let stats:string = "";
    let names:string = "";
    for(let i = 0; i < ids.length; i++){
        paras += ids[i].name + ":" + ids[i].type;
        stats += stats_begin + "." + ids[i].name + " === " + ids[i].name;
        names += ids[i].name;
        if(i < ids.length - 1){
            paras += ", ";
            stats += " && ";
            names += ", ";
        }
    }
    return {
        paras: paras,
        stats: stats,
        names: names
    }
}

export function writeFile(path:string, content:string):void{
    sys.writeFile(path, content);
}