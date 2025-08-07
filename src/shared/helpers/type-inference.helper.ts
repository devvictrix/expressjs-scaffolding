// ts-node src/shared/helpers/type-inference.helper.ts

/**
 * Recursively determines the TypeScript type of a given value.
 * Handles primitive types, arrays, and nested objects by constructing
 * TypeScript type definitions.
 * 
 * @param {any} value - The value whose type is to be determined.
 * @returns {string} - A string representing the TypeScript type of the given value.
 */
function getType(value: any): string {
    if (value === null) {
        return 'null';
    } else if (value === undefined) {
        return 'undefined';
    } else if (Array.isArray(value)) {
        if (value.length === 0) {
            return 'Array<any>';
        }
        // Get a set of unique types for array elements
        const uniqueTypes = new Set(value.map(item => getType(item)));
        return `Array<${Array.from(uniqueTypes).join(' | ')}>`;
    } else if (value instanceof Date) {  // Check if the value is a Date object
        return 'Date';
    } else if (typeof value === 'object') {
        return getInterface(value);
    }
    return typeof value;
}

/**
 * Constructs a TypeScript interface for a given object.
 * This function recursively calls getType to handle nested structures.
 * 
 * @param {object} obj - The object to convert into a TypeScript interface.
 * @returns {string} - A formatted string representing the TypeScript type interface of the object.
 */
function getInterface(obj: object): string {
    const properties = Object.entries(obj).map(([key, val]) => `${key}: ${getType(val)}`);
    return `{ ${properties.join('; ')} }`;
}

/**
 * Infers TypeScript interface definitions from an array of objects based on their values.
 * Constructs an interface string where properties are inferred from the objects' keys
 * and their corresponding values' types, considering deeply nested structures.
 * 
 * @param {string} interfaceName - The name of the TypeScript interface to be generated.
 * @param {any[]} data - An array of objects to analyze for type inference.
 * @returns {string} - A formatted string representing the TypeScript interface based on the data provided.
 */
export function inferTypesFromData(interfaceName: string, data: any[]): string {
    const typeDefinitions: { [key: string]: Set<string> } = {};

    data.forEach(item => {
        Object.entries(item).forEach(([key, value]) => {
            const valueType = getType(value);
            if (!typeDefinitions[key]) {
                typeDefinitions[key] = new Set();
            }
            typeDefinitions[key].add(valueType);
        });
    });

    const lines: string[] = [`${interfaceName} {`];
    Object.keys(typeDefinitions).forEach(key => {
        let types = Array.from(typeDefinitions[key]).sort().join(' | ');
        lines.push(`  ${key}: ${types};`);
    });

    lines.push('}');
    return lines.join('\n');
}

// Example Usage
const exampleData = [
    { name: "Alice", age: 30, dob: null, contacts: { email: "alice@example.com", phone: null } },
    { name: "Bob", age: null, dob: undefined, contacts: { email: "bob@example.com", phone: "123-456-7890" } }
];

console.log(inferTypesFromData("IUser", exampleData));
