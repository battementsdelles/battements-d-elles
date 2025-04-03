export interface ICustomError {
  code?: string;
  details: string;
  values?: Array<string | number>;
  path?: string;
}

interface IApiCustomError {
  customError: CustomError;
}

export class CustomError {
  code?: string;
  details!: string;
  values?: Array<string | number>;
  path?: string;

  constructor(obj: ICustomError) {
    Object.assign(this, obj);
  }

  toString = () => JSON.stringify(this);

  static apiCustomError = (
    obj: ICustomError | undefined,
  ): IApiCustomError | undefined => {
    if (!obj) return obj;
    return { customError: new CustomError(obj) };
  };

  static stringify = (obj: ICustomError) => JSON.stringify(obj);

  static ofTypeCustomError(obj: any): obj is ICustomError {
    return (
      typeof obj.details === 'string' &&
      (obj.code === undefined || typeof obj.code === 'string') &&
      (obj.path === undefined ||
        typeof obj.path === 'string' ||
        typeof obj.path === 'number') &&
      (obj.values === undefined ||
        (Array.isArray(obj.values) &&
          obj.values.every(
            (v: any) => typeof v === 'string' || typeof v === 'number',
          )))
    );
  }

  static parse(jsonString: string | undefined, path?: string | number) {
    if (jsonString === undefined) return undefined;
    let parsedObject: any;
    try {
      parsedObject = JSON.parse(jsonString);
    } catch (error) {
      parsedObject = { details: jsonString, path };
    }

    if (parsedObject.path === undefined && path !== undefined) {
      parsedObject.path = path;
    }

    if (this.ofTypeCustomError(parsedObject)) {
      return parsedObject;
    }
    throw new Error('The parsed object does not match the CustomError type');
  }
}
