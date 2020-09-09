export type TypedPathKey = string | symbol | number;

export interface TypedPathNode<T, K> {
    $: K;
    $path: string;
    $raw: TypedPathKey[];
}

export type TypedPathFunction<T> = (...args: any[]) => T;

export type TypedPathWrapper<T, K = TypedPathKey> = (
    T extends (infer Z)[]
        ? {
            [index: number]: TypedPathWrapper<Z, string>
        } : T extends TypedPathFunction<infer RET>
            ? (
                () => TypedPathWrapper<RET>
            ) & {
                [P in keyof RET]: TypedPathWrapper<RET[P], P>
            } : {
                [P in keyof T]: TypedPathWrapper<T[P], P>
            }
    ) & TypedPathNode<T, K>;

const toStringMethods: (string | symbol | number)[] = [
    'toString',
    Symbol.toStringTag,
    'valueOf',
];

function pathToString(path: string[]): string {
    return path.reduce((current, next) => {
        if (Number.isNaN(Number(next))) {
            current += current === '' ? `${next}` : `.${next}`;
        } else {
            current += `[${next}]`;
        }
        return current;
    }, '');
}

export function typedPath<T>(path: string[] = []): TypedPathWrapper<T> {
    return new Proxy({}, {
        get(target: T, name: TypedPathKey) {
            if (name === '$') {
                return path[path.length - 1];
            }

            if (name === '$path') {
                return pathToString(path);
            }

            if (name === '$raw') {
                return path;
            }

            if (toStringMethods.includes(name)) {
                return () => pathToString(path);
            }

            return typedPath([...path, name.toString()]);
        },
    }) as TypedPathWrapper<T>;
}
