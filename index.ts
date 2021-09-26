//Imports
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
        json.closeArray();
        sys.writeFile(source.json, json.getString());
    }

    private static createFileController(source){
        let sc:SourceObject = new SourceObject();
        sc.add("//Imports", 0);
        sc.add("import * as " + source.array + " from \"./" + source.json + "\";", 0);
        sc.add("import {" + source.object_name + "} from \"./" + source.object_file.replace(".ts", "") + "\";", 0);
        sc.newLine();
        sc.add("//Class", 0);
        let ext:string = "";
        if(!sys.isNull(source.controller_extends)){
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
        let id:string = this.getIdentifier(source.attributes);
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
    }

    private static createFileObject(source){
        let sc:SourceObject = new SourceObject();
        sc.add("//Imports", 0);
        sc.add("import * as " + source.array + " from \"./" + source.json + "\";", 0);
        sc.newLine();
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