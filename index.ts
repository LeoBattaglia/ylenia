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
        let attributes = [];
        for(let att of source.attributes){
            attributes.push({name: att.name, type: att.type});
        }
        for(let i = 0; i < source.defaults.length; i++){
            json.openObject();
            for(let o = 0; o < source.attributes.length; o++){
                let isString:Boolean;
                if(attributes[o].type === "boolean" || attributes[o].type === "number"){
                    isString = false;
                }else{
                    isString = true;
                }
                let setComma:Boolean;
                o < source.attributes.length - 1 ? setComma = true : setComma = false;
                json.addValue(attributes[o].name, source.defaults[i][o], isString, setComma);
            }
            json.closeObject();
            i < source.defaults.length - 1 ? json.add(",") : undefined;
        }
        json.closeArray();
        sys.writeFile(source.file_json, json.getString());
    }

    private static createFileController(source){
        let sc:SourceObject = new SourceObject();
        sc.add(func.createControllerImports(source), 0);
        sc.add(func.createControllerConstants(), 0);
        sc.add("//Class", 0);
        let ext:string = "";
        if(!sys.isNull(source.controller_extends)){
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
    }

    private static createFileObject(source){
        let sc:SourceObject = new SourceObject();
        sc.add("//Class", 0);
        let ext:string = "";
        if(!sys.isNull(source.object_extends)){
            ext = " extends " + source.object_extends;
        }
        sc.add("export class " + source.object_name + ext + "{", 0);
        sc.add(func.createObjectDeclarations(source), 0);
        sc.add(func.createObjectConstructor(source), 0);
        sc.add(func.createObjectGetMethods(source), 0);
        sc.add(func.createObjectSetMethods(source), 0);
        sc.add("}", 0);
        sys.writeFile(source.file_object, sc.getString());
    }

    generateSources():Boolean{
        if(this.parseJSON()){
            for(let source of this.json.sources){
                DataSources.createFileJSON(source);
                DataSources.createFileObject(source);
                DataSources.createFileController(source);
            }
            return true;
        }
        return false;
    }

    private parseJSON():Boolean{
        try{
            this.json = JSON.parse(sys.readFile(this.path));
            return this.json.sources !== undefined;
        }catch(e){
            return false;
        }
    }
}