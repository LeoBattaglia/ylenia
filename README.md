# Ylenia
TypeScript-Code- and JSON-Generator. Based on a Definition in a JSON-File, this DataSource-Object generates for each DataSource a JSON-Source-File to store and two TypeScript-Classes to access and work data.

### JSON-File
The generated JSON-Files are ready to contain all data, defined in Definition-File. You don't have to think about the structure because you only access the data with the following two TypeScript-Files:

### TypeScript-Files
Ylenia generates two TypeScript-Files with one Class each. One Class represents the object, for Example "Attribute". The other Class is a Controller to work with the Object-Class, for Example "Attributes".

#### Object-Class
Let's say we define an Object which represents a Person and contains a Pre- and a Lastname. The Object-Class contains the Data and all Get- and Set-Methods.

#### Controller-Class
The Controller-Class contains an Array of Objects, based on the Object-Class. It also contains some Default-Methods:

- add
- addProtected (Does not add, if the Object already exists)
- exist
- get
- getAll
- load
- remove
- save

## Import
```
import {DataSources} from "ylenia";
let ds = new DataSources("./definition.json");
``` 