export type IGenericObject<TValue> = {
    [key: string]: TValue;
};

export class AjaxHandler {

    static getRequest(url: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const response: Response = await fetch(url);
                if (response.ok) {
                    return resolve(response.json());
                }
                else {
                    const err = await response.json();
                    throw new Error(err.message);
                }
            }
            catch (err) {
                return reject(err);
            }
        });
    }

    static putRequest(url: string, data: IGenericObject<any> = {}): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const dataFormated = {};
                this.assign(dataFormated, ["attributes", data.key], data.val);
                // console.log(dataFormated);

                const response: Response = await fetch(url, {
                    method: "PUT", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, cors, *same-origin
                    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    // credentials: "same-origin", // include, *same-origin, omit
                    headers: {
                        "Content-Type": "application/json",
                        // "Content-Type": "application/x-www-form-urlencoded",
                    },
                    // redirect: "follow", // manual, *follow, error
                    // referrer: "no-referrer", // no-referrer, *client
                    body: JSON.stringify(dataFormated), // body data type must match "Content-Type" header
                });
                // console.log(response);
                if (response.ok) {
                    return resolve(response.json());
                }
                else {
                    const err = await response.json();
                    throw new Error(err.message);
                }
            }
            catch (err) {
                return reject(err);
            }
        });
    }

    static postRequest(url: string, data: IGenericObject<any> = {}): Promise<any> {
        console.log(JSON.stringify(data));
        return new Promise(async (resolve, reject) => {
            try {
                const response: Response = await fetch(url, {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    return resolve(response.json());
                }
                else {
                    console.log("a");
                    const err = await response.json();
                    console.log(err);
                    if (err instanceof Array) {
                        throw new Error(err[0].msg); // Get only the first express-validator result
                    }
                    else {
                        throw new Error(err.message);
                    }
                }
            }
            catch (err) {
                console.log("b");
                console.log(err);
                return reject(err);
            }
        });
    }

    static assign(obj: IGenericObject<any>, keyArray: string[], value: string) {
        const lastKeyIndex = keyArray.length - 1;
        for (let i = 0; i < lastKeyIndex; i++) {
            const key = keyArray[i];
            if (!(key in obj)) {
                obj[key] = {};
            }
            obj = obj[key];
        }
        obj[keyArray[lastKeyIndex]] = value;
    }
}
