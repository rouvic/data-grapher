export class Parameter {
    constructor(name, description, optional=false) {
        this.name = name;
        this.description = description;
        this.optional = optional;
    }
}

export class Script {
    constructor(name, description, code, params) {
        this.name = name;
        this.params = params;
        this.description = description;
        this.code = code;
    }

    run(values) {
        // TODO: populate eval context with values...
        let context = {};

        for (let expected of this.params) {
            if (!expected.optional && !values[expected.name]) {
                throw new Error("Expected param named '" + expected.name + "' but got " + values);
            }

            context[expected.name] = values[expected.name];
        }

        let paramStr = "";
        for (let key of Object.keys(context)) {
            paramStr += "," + key;
        }

        let actualValues = [];

        for (let entry of Object.entries(context)) {
            actualValues.push(entry[1]);
        }

        paramStr = paramStr.substring(1, paramStr.length);

        return window.eval.call(window,'(function ('+ paramStr +') {'+this.code+'})')(...actualValues);

        // return eval(this.code);
    }
}
