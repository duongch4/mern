import Log from "./Log";

export type TGenericObject<TValue> = {
    [key: string]: TValue;
};

export class AjaxHandler {

    public static getRequest(url: string): Promise<any> {
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

    public static putRequest(url: string, data: TGenericObject<any> = {}): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                // const dataFormated = {};
                // this.assign(dataFormated, ["attributes", data.key], data.val);
                // Log.trace(dataFormated);

                const response: Response = await fetch(url, {
                    method: "PUT", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, cors, *same-origin
                    // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                    // credentials: "same-origin", // include, *same-origin, omit
                    headers: {
                        "Content-Type": "application/json",
                        // "Content-Type": "application/x-www-form-urlencoded",
                        "Accept": "application/json"
                    },
                    // redirect: "follow", // manual, *follow, error
                    // referrer: "no-referrer", // no-referrer, *client
                    body: JSON.stringify(data), // body data type must match "Content-Type" header
                });
                // Log.trace(response);
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

    public static postRequest(url: string, data: TGenericObject<any> = {}): Promise<any> {
        // Log.trace(JSON.stringify(data));
        return new Promise(async (resolve, reject) => {
            try {
                const response: Response = await fetch(url, {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    return resolve(response.json());
                }
                else {
                    const err = await response.json();
                    Log.error(err);
                    if (err instanceof Array) {
                        throw new Error(err[0].msg); // Get only the first express-validator result
                    }
                    else {
                        throw new Error(err.message);
                    }
                }
            }
            catch (err) {
                Log.error(err);
                return reject(err);
            }
        });
    }

    private static assign(obj: TGenericObject<any>, keyArray: string[], value: string) {
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
