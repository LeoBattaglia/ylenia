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
    sc.add("if(!this.exist(" + source.controller_object.toLowerCase() + "." + getIdentifier(source.attributes).name + ")){", 2);
    sc.add("this.add(" + source.controller_object.toLowerCase() + ");", 3);
    sc.add("}", 2);
    sc.add("}", 1);
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
    let identifier = getIdentifier(source.attributes);
    sc.add("exist(" + identifier.name + ":" + identifier.type + "):Boolean{", 1);
    sc.add("return this.get(" + identifier.name + ") !== undefined;", 2);
    sc.add("}", 1);
    return sc.getString();
}

export function createControllerGet(source):string{
    let sc:SourceObject = new SourceObject();
    let identifier = getIdentifier(source.attributes);
    sc.add("get(" + identifier.name + ":" + identifier.type + "):" + source.object_name + "{", 1);
    sc.add("for(let " + source.controller_object.toLowerCase() + " of this." + source.array + "){", 2);
    sc.add("if(" + source.controller_object.toLowerCase() + "." + identifier.name + " === " + identifier.name + "){", 3);
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
    let sc:SourceObject = new SourceObject();
    sc.add("//Imports", 0);
    sc.add("import * as data from \"" + source.file_json + "\";", 0);
    sc.add("import {" + source.object_name + "} from \"" + source.file_object.replace(".ts", "") + "\";", 0);
    sc.add("import * as func from \"./functions\";", 0);
    return sc.getString();
}

export function createControllerLoad(source):string{
    let sc:SourceObject = new SourceObject();
    sc.add("load():void{", 1);
    sc.add("for(let " + source.controller_object.toLowerCase() + " of data." + source.array + "){", 2);
    let paras:string = "";
    let count:number = 0;
    for(let attribute of source.attributes){
        count > 0 ? paras += ", " : undefined;
        paras += source.controller_object.toLowerCase() + "." + attribute.name;
        count++;
    }
    sc.add("let object:" + source.object_name + " = new " + source.object_name + "(" + paras + ");", 3);
    sc.add("this." + source.array + ".push(object);", 3);
    sc.add("}", 2);
    sc.add("}", 1);
    return sc.getString();
}

export function createControllerRemove(source):string{
    let sc:SourceObject = new SourceObject();
    let identifier = getIdentifier(source.attributes);
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

export function createControllerSave(source):string{
    let sc:SourceObject = new SourceObject();
    sc.add("save(){", 1);
    //sc.add("for(let " + source.controller_object.toLowerCase() + " of this." + source.controller_array + "){", 2);
    sc.add("let json:string = JSON.stringify(this." + source.array + ");", 2);
    sc.add("func.writeFile(\"" + source.file_json + "\", json);", 2);

    //TODO: All

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
        sc.add("private _" + att.name + ":" + att.type + ";", 1);
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

export function getIdentifier(attributes){
    for(let att of attributes){
        if(att.identifier){
            return {
                name: att.name,
                type: att.type
            };
        }
    }
    return undefined;
}

export function writeFile(path:string, content:string):void{
    sys.writeFile(path, content);
}