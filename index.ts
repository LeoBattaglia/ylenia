//Imports
import * as func from "./functions";
import * as sys from "samara";
import {JSONObject, SourceObject} from "samara";

//Class
export class DataSources{
    //Declarations
    private json;
    private readonly path:string;

    //Constructor
    constructor(path:string){
        this.path = path;
    }

    //Methods
    private static createFileJSON(source){
        let json:JSONObject = new JSONObject();
        json.addName(source.array);
        json.openArray();

        //TODO: Insert Default-Values

        json.closeArray();
        sys.writeFile(source.json, json.getString());
    }

    private static createFileController(source){
        let sc:SourceObject = new SourceObject();
        sc.add(func.createControllerImports(source), 0);
        sc.add("//Class", 0);
        let ext:string = "";
        if(!sys.isNull(source.controller_extends)){
            ext = " extends " + source.controller_extends;
        }
        sc.add("export class " + source.controller_name + ext + "{", 0);
        sc.add("//Declarations", 1);
        sc.add("private readonly " + source.controller_array + ":" + source.object_name + "[];", 1);
        sc.newLine();
        sc.add(func.createControllerConstructor(source), 0);
        sc.add("//Methods", 1);
        sc.add(func.createControllerAdd(source), 0);
        //let id:string = this.getIdentifier(source.attributes);
        sc.add(func.createControllerAddProtected(source), 0);
        sc.add(func.createControllerExist(source), 0);
        sc.add(func.createControllerGet(source), 0);
        sc.add(func.createControllerGetAll(source), 0);
        sc.add(func.createControllerLoad(source), 0);
        sc.add(func.createControllerRemove(source), 0);
        sc.add(func.createControllerSave(source), 0);
        sc.add("}", 0);
        sys.writeFile(source.controller_file, sc.getString());
    }

    private static createFileObject(source){
        let sc:SourceObject = new SourceObject();
        //sc.add("//Imports", 0);
        //sc.add(func.createImportData(source.json), 0);
        //sc.newLine();
        sc.add("//Class", 0);
        let ext:string = "";
        if(!sys.isNull(source.object_extends)){
            ext = " extends " + source.object_extends;
        }
        sc.add("export class " + source.object_name + ext + "{", 0);
        sc.add("//Declarations", 1);
        for(let att of source.attributes){
            sc.add("private _" + att.name + ":" + att.type + ";", 1);
        }
        sc.newLine();
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
        sc.newLine();
        sc.add("//Get-Methods", 1);
        for(let att of source.attributes){
            sc.add("get " + att.name + "():" + att.type + "{", 1);
            sc.add("return this._" + att.name + ";", 2);
            sc.add("}", 1);
            sc.newLine();
        }
        sc.add("//Set-Methods", 1);
        for(let att of source.attributes){
            sc.add("set " + att.name + "(value:" + att.type + "){", 1);
            sc.add("this._" + att.name + " = value;", 2);
            sc.add("}", 1);
            sc.newLine();
        }
        sc.add("}", 0);
        sys.writeFile(source.object_file, sc.getString());
    }

    generateSource():Boolean{
        if(this.parseJSON()){
            console.log("VALID SOURCE");
            for(let source of this.json.sources){
                console.log("Name: " + source.name);
                DataSources.createFileJSON(source);
                DataSources.createFileObject(source);
                DataSources.createFileController(source);
            }
            return true;
        }
        return false;
    }

    private static getIdentifier(attributes):string{
        for(let att of attributes){
            if(att.identifier){
                return att.name;
            }
        }
        return undefined;
    }

    parseJSON():Boolean{
        try{
            this.json = JSON.parse(sys.readFile(this.path));
            if(this.json.sources === undefined){
                return false;
            }else{
                return true;
            }
        }catch(e){
            return false;
        }
    }
}