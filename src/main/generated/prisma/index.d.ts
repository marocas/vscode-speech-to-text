
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model UserLlmSettings
 * 
 */
export type UserLlmSettings = $Result.DefaultSelection<Prisma.$UserLlmSettingsPayload>
/**
 * Model Dictionary
 * 
 */
export type Dictionary = $Result.DefaultSelection<Prisma.$DictionaryPayload>
/**
 * Model Snippet
 * 
 */
export type Snippet = $Result.DefaultSelection<Prisma.$SnippetPayload>
/**
 * Model Dictation
 * 
 */
export type Dictation = $Result.DefaultSelection<Prisma.$DictationPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userLlmSettings`: Exposes CRUD operations for the **UserLlmSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserLlmSettings
    * const userLlmSettings = await prisma.userLlmSettings.findMany()
    * ```
    */
  get userLlmSettings(): Prisma.UserLlmSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dictionary`: Exposes CRUD operations for the **Dictionary** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dictionaries
    * const dictionaries = await prisma.dictionary.findMany()
    * ```
    */
  get dictionary(): Prisma.DictionaryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.snippet`: Exposes CRUD operations for the **Snippet** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Snippets
    * const snippets = await prisma.snippet.findMany()
    * ```
    */
  get snippet(): Prisma.SnippetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dictation`: Exposes CRUD operations for the **Dictation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dictations
    * const dictations = await prisma.dictation.findMany()
    * ```
    */
  get dictation(): Prisma.DictationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    UserLlmSettings: 'UserLlmSettings',
    Dictionary: 'Dictionary',
    Snippet: 'Snippet',
    Dictation: 'Dictation'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "userLlmSettings" | "dictionary" | "snippet" | "dictation"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      UserLlmSettings: {
        payload: Prisma.$UserLlmSettingsPayload<ExtArgs>
        fields: Prisma.UserLlmSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserLlmSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLlmSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserLlmSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLlmSettingsPayload>
          }
          findFirst: {
            args: Prisma.UserLlmSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLlmSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserLlmSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLlmSettingsPayload>
          }
          findMany: {
            args: Prisma.UserLlmSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLlmSettingsPayload>[]
          }
          create: {
            args: Prisma.UserLlmSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLlmSettingsPayload>
          }
          createMany: {
            args: Prisma.UserLlmSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserLlmSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLlmSettingsPayload>[]
          }
          delete: {
            args: Prisma.UserLlmSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLlmSettingsPayload>
          }
          update: {
            args: Prisma.UserLlmSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLlmSettingsPayload>
          }
          deleteMany: {
            args: Prisma.UserLlmSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserLlmSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserLlmSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLlmSettingsPayload>[]
          }
          upsert: {
            args: Prisma.UserLlmSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLlmSettingsPayload>
          }
          aggregate: {
            args: Prisma.UserLlmSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserLlmSettings>
          }
          groupBy: {
            args: Prisma.UserLlmSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserLlmSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserLlmSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<UserLlmSettingsCountAggregateOutputType> | number
          }
        }
      }
      Dictionary: {
        payload: Prisma.$DictionaryPayload<ExtArgs>
        fields: Prisma.DictionaryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DictionaryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictionaryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DictionaryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictionaryPayload>
          }
          findFirst: {
            args: Prisma.DictionaryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictionaryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DictionaryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictionaryPayload>
          }
          findMany: {
            args: Prisma.DictionaryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictionaryPayload>[]
          }
          create: {
            args: Prisma.DictionaryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictionaryPayload>
          }
          createMany: {
            args: Prisma.DictionaryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DictionaryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictionaryPayload>[]
          }
          delete: {
            args: Prisma.DictionaryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictionaryPayload>
          }
          update: {
            args: Prisma.DictionaryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictionaryPayload>
          }
          deleteMany: {
            args: Prisma.DictionaryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DictionaryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DictionaryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictionaryPayload>[]
          }
          upsert: {
            args: Prisma.DictionaryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictionaryPayload>
          }
          aggregate: {
            args: Prisma.DictionaryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDictionary>
          }
          groupBy: {
            args: Prisma.DictionaryGroupByArgs<ExtArgs>
            result: $Utils.Optional<DictionaryGroupByOutputType>[]
          }
          count: {
            args: Prisma.DictionaryCountArgs<ExtArgs>
            result: $Utils.Optional<DictionaryCountAggregateOutputType> | number
          }
        }
      }
      Snippet: {
        payload: Prisma.$SnippetPayload<ExtArgs>
        fields: Prisma.SnippetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SnippetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnippetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SnippetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnippetPayload>
          }
          findFirst: {
            args: Prisma.SnippetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnippetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SnippetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnippetPayload>
          }
          findMany: {
            args: Prisma.SnippetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnippetPayload>[]
          }
          create: {
            args: Prisma.SnippetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnippetPayload>
          }
          createMany: {
            args: Prisma.SnippetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SnippetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnippetPayload>[]
          }
          delete: {
            args: Prisma.SnippetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnippetPayload>
          }
          update: {
            args: Prisma.SnippetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnippetPayload>
          }
          deleteMany: {
            args: Prisma.SnippetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SnippetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SnippetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnippetPayload>[]
          }
          upsert: {
            args: Prisma.SnippetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SnippetPayload>
          }
          aggregate: {
            args: Prisma.SnippetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSnippet>
          }
          groupBy: {
            args: Prisma.SnippetGroupByArgs<ExtArgs>
            result: $Utils.Optional<SnippetGroupByOutputType>[]
          }
          count: {
            args: Prisma.SnippetCountArgs<ExtArgs>
            result: $Utils.Optional<SnippetCountAggregateOutputType> | number
          }
        }
      }
      Dictation: {
        payload: Prisma.$DictationPayload<ExtArgs>
        fields: Prisma.DictationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DictationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DictationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictationPayload>
          }
          findFirst: {
            args: Prisma.DictationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DictationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictationPayload>
          }
          findMany: {
            args: Prisma.DictationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictationPayload>[]
          }
          create: {
            args: Prisma.DictationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictationPayload>
          }
          createMany: {
            args: Prisma.DictationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DictationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictationPayload>[]
          }
          delete: {
            args: Prisma.DictationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictationPayload>
          }
          update: {
            args: Prisma.DictationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictationPayload>
          }
          deleteMany: {
            args: Prisma.DictationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DictationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DictationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictationPayload>[]
          }
          upsert: {
            args: Prisma.DictationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DictationPayload>
          }
          aggregate: {
            args: Prisma.DictationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDictation>
          }
          groupBy: {
            args: Prisma.DictationGroupByArgs<ExtArgs>
            result: $Utils.Optional<DictationGroupByOutputType>[]
          }
          count: {
            args: Prisma.DictationCountArgs<ExtArgs>
            result: $Utils.Optional<DictationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    userLlmSettings?: UserLlmSettingsOmit
    dictionary?: DictionaryOmit
    snippet?: SnippetOmit
    dictation?: DictationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    dictations: number
    dictionaries: number
    snippets: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dictations?: boolean | UserCountOutputTypeCountDictationsArgs
    dictionaries?: boolean | UserCountOutputTypeCountDictionariesArgs
    snippets?: boolean | UserCountOutputTypeCountSnippetsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDictationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DictationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDictionariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DictionaryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSnippetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnippetWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    passwordHash: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    passwordHash: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    passwordHash: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    passwordHash?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    username: string
    passwordHash: string
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    dictations?: boolean | User$dictationsArgs<ExtArgs>
    dictionaries?: boolean | User$dictionariesArgs<ExtArgs>
    snippets?: boolean | User$snippetsArgs<ExtArgs>
    llmSettings?: boolean | User$llmSettingsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    passwordHash?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "username" | "passwordHash" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    dictations?: boolean | User$dictationsArgs<ExtArgs>
    dictionaries?: boolean | User$dictionariesArgs<ExtArgs>
    snippets?: boolean | User$snippetsArgs<ExtArgs>
    llmSettings?: boolean | User$llmSettingsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      dictations: Prisma.$DictationPayload<ExtArgs>[]
      dictionaries: Prisma.$DictionaryPayload<ExtArgs>[]
      snippets: Prisma.$SnippetPayload<ExtArgs>[]
      llmSettings: Prisma.$UserLlmSettingsPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      passwordHash: string
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    dictations<T extends User$dictationsArgs<ExtArgs> = {}>(args?: Subset<T, User$dictationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DictationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    dictionaries<T extends User$dictionariesArgs<ExtArgs> = {}>(args?: Subset<T, User$dictionariesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DictionaryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    snippets<T extends User$snippetsArgs<ExtArgs> = {}>(args?: Subset<T, User$snippetsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    llmSettings<T extends User$llmSettingsArgs<ExtArgs> = {}>(args?: Subset<T, User$llmSettingsArgs<ExtArgs>>): Prisma__UserLlmSettingsClient<$Result.GetResult<Prisma.$UserLlmSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.dictations
   */
  export type User$dictationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationInclude<ExtArgs> | null
    where?: DictationWhereInput
    orderBy?: DictationOrderByWithRelationInput | DictationOrderByWithRelationInput[]
    cursor?: DictationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DictationScalarFieldEnum | DictationScalarFieldEnum[]
  }

  /**
   * User.dictionaries
   */
  export type User$dictionariesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryInclude<ExtArgs> | null
    where?: DictionaryWhereInput
    orderBy?: DictionaryOrderByWithRelationInput | DictionaryOrderByWithRelationInput[]
    cursor?: DictionaryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DictionaryScalarFieldEnum | DictionaryScalarFieldEnum[]
  }

  /**
   * User.snippets
   */
  export type User$snippetsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetInclude<ExtArgs> | null
    where?: SnippetWhereInput
    orderBy?: SnippetOrderByWithRelationInput | SnippetOrderByWithRelationInput[]
    cursor?: SnippetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SnippetScalarFieldEnum | SnippetScalarFieldEnum[]
  }

  /**
   * User.llmSettings
   */
  export type User$llmSettingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsInclude<ExtArgs> | null
    where?: UserLlmSettingsWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model UserLlmSettings
   */

  export type AggregateUserLlmSettings = {
    _count: UserLlmSettingsCountAggregateOutputType | null
    _min: UserLlmSettingsMinAggregateOutputType | null
    _max: UserLlmSettingsMaxAggregateOutputType | null
  }

  export type UserLlmSettingsMinAggregateOutputType = {
    id: string | null
    userId: string | null
    ollamaBaseUrl: string | null
    ollamaModel: string | null
    ollamaTranslationModel: string | null
    ollamaPrompt: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserLlmSettingsMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    ollamaBaseUrl: string | null
    ollamaModel: string | null
    ollamaTranslationModel: string | null
    ollamaPrompt: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserLlmSettingsCountAggregateOutputType = {
    id: number
    userId: number
    ollamaBaseUrl: number
    ollamaModel: number
    ollamaTranslationModel: number
    ollamaPrompt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserLlmSettingsMinAggregateInputType = {
    id?: true
    userId?: true
    ollamaBaseUrl?: true
    ollamaModel?: true
    ollamaTranslationModel?: true
    ollamaPrompt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserLlmSettingsMaxAggregateInputType = {
    id?: true
    userId?: true
    ollamaBaseUrl?: true
    ollamaModel?: true
    ollamaTranslationModel?: true
    ollamaPrompt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserLlmSettingsCountAggregateInputType = {
    id?: true
    userId?: true
    ollamaBaseUrl?: true
    ollamaModel?: true
    ollamaTranslationModel?: true
    ollamaPrompt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserLlmSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserLlmSettings to aggregate.
     */
    where?: UserLlmSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLlmSettings to fetch.
     */
    orderBy?: UserLlmSettingsOrderByWithRelationInput | UserLlmSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserLlmSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLlmSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLlmSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserLlmSettings
    **/
    _count?: true | UserLlmSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserLlmSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserLlmSettingsMaxAggregateInputType
  }

  export type GetUserLlmSettingsAggregateType<T extends UserLlmSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateUserLlmSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserLlmSettings[P]>
      : GetScalarType<T[P], AggregateUserLlmSettings[P]>
  }




  export type UserLlmSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserLlmSettingsWhereInput
    orderBy?: UserLlmSettingsOrderByWithAggregationInput | UserLlmSettingsOrderByWithAggregationInput[]
    by: UserLlmSettingsScalarFieldEnum[] | UserLlmSettingsScalarFieldEnum
    having?: UserLlmSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserLlmSettingsCountAggregateInputType | true
    _min?: UserLlmSettingsMinAggregateInputType
    _max?: UserLlmSettingsMaxAggregateInputType
  }

  export type UserLlmSettingsGroupByOutputType = {
    id: string
    userId: string
    ollamaBaseUrl: string
    ollamaModel: string
    ollamaTranslationModel: string
    ollamaPrompt: string
    createdAt: Date
    updatedAt: Date
    _count: UserLlmSettingsCountAggregateOutputType | null
    _min: UserLlmSettingsMinAggregateOutputType | null
    _max: UserLlmSettingsMaxAggregateOutputType | null
  }

  type GetUserLlmSettingsGroupByPayload<T extends UserLlmSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserLlmSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserLlmSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserLlmSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], UserLlmSettingsGroupByOutputType[P]>
        }
      >
    >


  export type UserLlmSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ollamaBaseUrl?: boolean
    ollamaModel?: boolean
    ollamaTranslationModel?: boolean
    ollamaPrompt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userLlmSettings"]>

  export type UserLlmSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ollamaBaseUrl?: boolean
    ollamaModel?: boolean
    ollamaTranslationModel?: boolean
    ollamaPrompt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userLlmSettings"]>

  export type UserLlmSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ollamaBaseUrl?: boolean
    ollamaModel?: boolean
    ollamaTranslationModel?: boolean
    ollamaPrompt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userLlmSettings"]>

  export type UserLlmSettingsSelectScalar = {
    id?: boolean
    userId?: boolean
    ollamaBaseUrl?: boolean
    ollamaModel?: boolean
    ollamaTranslationModel?: boolean
    ollamaPrompt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserLlmSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "ollamaBaseUrl" | "ollamaModel" | "ollamaTranslationModel" | "ollamaPrompt" | "createdAt" | "updatedAt", ExtArgs["result"]["userLlmSettings"]>
  export type UserLlmSettingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserLlmSettingsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserLlmSettingsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserLlmSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserLlmSettings"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      ollamaBaseUrl: string
      ollamaModel: string
      ollamaTranslationModel: string
      ollamaPrompt: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userLlmSettings"]>
    composites: {}
  }

  type UserLlmSettingsGetPayload<S extends boolean | null | undefined | UserLlmSettingsDefaultArgs> = $Result.GetResult<Prisma.$UserLlmSettingsPayload, S>

  type UserLlmSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserLlmSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserLlmSettingsCountAggregateInputType | true
    }

  export interface UserLlmSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserLlmSettings'], meta: { name: 'UserLlmSettings' } }
    /**
     * Find zero or one UserLlmSettings that matches the filter.
     * @param {UserLlmSettingsFindUniqueArgs} args - Arguments to find a UserLlmSettings
     * @example
     * // Get one UserLlmSettings
     * const userLlmSettings = await prisma.userLlmSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserLlmSettingsFindUniqueArgs>(args: SelectSubset<T, UserLlmSettingsFindUniqueArgs<ExtArgs>>): Prisma__UserLlmSettingsClient<$Result.GetResult<Prisma.$UserLlmSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserLlmSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserLlmSettingsFindUniqueOrThrowArgs} args - Arguments to find a UserLlmSettings
     * @example
     * // Get one UserLlmSettings
     * const userLlmSettings = await prisma.userLlmSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserLlmSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, UserLlmSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserLlmSettingsClient<$Result.GetResult<Prisma.$UserLlmSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserLlmSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLlmSettingsFindFirstArgs} args - Arguments to find a UserLlmSettings
     * @example
     * // Get one UserLlmSettings
     * const userLlmSettings = await prisma.userLlmSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserLlmSettingsFindFirstArgs>(args?: SelectSubset<T, UserLlmSettingsFindFirstArgs<ExtArgs>>): Prisma__UserLlmSettingsClient<$Result.GetResult<Prisma.$UserLlmSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserLlmSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLlmSettingsFindFirstOrThrowArgs} args - Arguments to find a UserLlmSettings
     * @example
     * // Get one UserLlmSettings
     * const userLlmSettings = await prisma.userLlmSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserLlmSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, UserLlmSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserLlmSettingsClient<$Result.GetResult<Prisma.$UserLlmSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserLlmSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLlmSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserLlmSettings
     * const userLlmSettings = await prisma.userLlmSettings.findMany()
     * 
     * // Get first 10 UserLlmSettings
     * const userLlmSettings = await prisma.userLlmSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userLlmSettingsWithIdOnly = await prisma.userLlmSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserLlmSettingsFindManyArgs>(args?: SelectSubset<T, UserLlmSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLlmSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserLlmSettings.
     * @param {UserLlmSettingsCreateArgs} args - Arguments to create a UserLlmSettings.
     * @example
     * // Create one UserLlmSettings
     * const UserLlmSettings = await prisma.userLlmSettings.create({
     *   data: {
     *     // ... data to create a UserLlmSettings
     *   }
     * })
     * 
     */
    create<T extends UserLlmSettingsCreateArgs>(args: SelectSubset<T, UserLlmSettingsCreateArgs<ExtArgs>>): Prisma__UserLlmSettingsClient<$Result.GetResult<Prisma.$UserLlmSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserLlmSettings.
     * @param {UserLlmSettingsCreateManyArgs} args - Arguments to create many UserLlmSettings.
     * @example
     * // Create many UserLlmSettings
     * const userLlmSettings = await prisma.userLlmSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserLlmSettingsCreateManyArgs>(args?: SelectSubset<T, UserLlmSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserLlmSettings and returns the data saved in the database.
     * @param {UserLlmSettingsCreateManyAndReturnArgs} args - Arguments to create many UserLlmSettings.
     * @example
     * // Create many UserLlmSettings
     * const userLlmSettings = await prisma.userLlmSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserLlmSettings and only return the `id`
     * const userLlmSettingsWithIdOnly = await prisma.userLlmSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserLlmSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, UserLlmSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLlmSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserLlmSettings.
     * @param {UserLlmSettingsDeleteArgs} args - Arguments to delete one UserLlmSettings.
     * @example
     * // Delete one UserLlmSettings
     * const UserLlmSettings = await prisma.userLlmSettings.delete({
     *   where: {
     *     // ... filter to delete one UserLlmSettings
     *   }
     * })
     * 
     */
    delete<T extends UserLlmSettingsDeleteArgs>(args: SelectSubset<T, UserLlmSettingsDeleteArgs<ExtArgs>>): Prisma__UserLlmSettingsClient<$Result.GetResult<Prisma.$UserLlmSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserLlmSettings.
     * @param {UserLlmSettingsUpdateArgs} args - Arguments to update one UserLlmSettings.
     * @example
     * // Update one UserLlmSettings
     * const userLlmSettings = await prisma.userLlmSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserLlmSettingsUpdateArgs>(args: SelectSubset<T, UserLlmSettingsUpdateArgs<ExtArgs>>): Prisma__UserLlmSettingsClient<$Result.GetResult<Prisma.$UserLlmSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserLlmSettings.
     * @param {UserLlmSettingsDeleteManyArgs} args - Arguments to filter UserLlmSettings to delete.
     * @example
     * // Delete a few UserLlmSettings
     * const { count } = await prisma.userLlmSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserLlmSettingsDeleteManyArgs>(args?: SelectSubset<T, UserLlmSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserLlmSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLlmSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserLlmSettings
     * const userLlmSettings = await prisma.userLlmSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserLlmSettingsUpdateManyArgs>(args: SelectSubset<T, UserLlmSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserLlmSettings and returns the data updated in the database.
     * @param {UserLlmSettingsUpdateManyAndReturnArgs} args - Arguments to update many UserLlmSettings.
     * @example
     * // Update many UserLlmSettings
     * const userLlmSettings = await prisma.userLlmSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserLlmSettings and only return the `id`
     * const userLlmSettingsWithIdOnly = await prisma.userLlmSettings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserLlmSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, UserLlmSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLlmSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserLlmSettings.
     * @param {UserLlmSettingsUpsertArgs} args - Arguments to update or create a UserLlmSettings.
     * @example
     * // Update or create a UserLlmSettings
     * const userLlmSettings = await prisma.userLlmSettings.upsert({
     *   create: {
     *     // ... data to create a UserLlmSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserLlmSettings we want to update
     *   }
     * })
     */
    upsert<T extends UserLlmSettingsUpsertArgs>(args: SelectSubset<T, UserLlmSettingsUpsertArgs<ExtArgs>>): Prisma__UserLlmSettingsClient<$Result.GetResult<Prisma.$UserLlmSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserLlmSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLlmSettingsCountArgs} args - Arguments to filter UserLlmSettings to count.
     * @example
     * // Count the number of UserLlmSettings
     * const count = await prisma.userLlmSettings.count({
     *   where: {
     *     // ... the filter for the UserLlmSettings we want to count
     *   }
     * })
    **/
    count<T extends UserLlmSettingsCountArgs>(
      args?: Subset<T, UserLlmSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserLlmSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserLlmSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLlmSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserLlmSettingsAggregateArgs>(args: Subset<T, UserLlmSettingsAggregateArgs>): Prisma.PrismaPromise<GetUserLlmSettingsAggregateType<T>>

    /**
     * Group by UserLlmSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLlmSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserLlmSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserLlmSettingsGroupByArgs['orderBy'] }
        : { orderBy?: UserLlmSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserLlmSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserLlmSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserLlmSettings model
   */
  readonly fields: UserLlmSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserLlmSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserLlmSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserLlmSettings model
   */
  interface UserLlmSettingsFieldRefs {
    readonly id: FieldRef<"UserLlmSettings", 'String'>
    readonly userId: FieldRef<"UserLlmSettings", 'String'>
    readonly ollamaBaseUrl: FieldRef<"UserLlmSettings", 'String'>
    readonly ollamaModel: FieldRef<"UserLlmSettings", 'String'>
    readonly ollamaTranslationModel: FieldRef<"UserLlmSettings", 'String'>
    readonly ollamaPrompt: FieldRef<"UserLlmSettings", 'String'>
    readonly createdAt: FieldRef<"UserLlmSettings", 'DateTime'>
    readonly updatedAt: FieldRef<"UserLlmSettings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserLlmSettings findUnique
   */
  export type UserLlmSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserLlmSettings to fetch.
     */
    where: UserLlmSettingsWhereUniqueInput
  }

  /**
   * UserLlmSettings findUniqueOrThrow
   */
  export type UserLlmSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserLlmSettings to fetch.
     */
    where: UserLlmSettingsWhereUniqueInput
  }

  /**
   * UserLlmSettings findFirst
   */
  export type UserLlmSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserLlmSettings to fetch.
     */
    where?: UserLlmSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLlmSettings to fetch.
     */
    orderBy?: UserLlmSettingsOrderByWithRelationInput | UserLlmSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserLlmSettings.
     */
    cursor?: UserLlmSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLlmSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLlmSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserLlmSettings.
     */
    distinct?: UserLlmSettingsScalarFieldEnum | UserLlmSettingsScalarFieldEnum[]
  }

  /**
   * UserLlmSettings findFirstOrThrow
   */
  export type UserLlmSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserLlmSettings to fetch.
     */
    where?: UserLlmSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLlmSettings to fetch.
     */
    orderBy?: UserLlmSettingsOrderByWithRelationInput | UserLlmSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserLlmSettings.
     */
    cursor?: UserLlmSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLlmSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLlmSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserLlmSettings.
     */
    distinct?: UserLlmSettingsScalarFieldEnum | UserLlmSettingsScalarFieldEnum[]
  }

  /**
   * UserLlmSettings findMany
   */
  export type UserLlmSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsInclude<ExtArgs> | null
    /**
     * Filter, which UserLlmSettings to fetch.
     */
    where?: UserLlmSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLlmSettings to fetch.
     */
    orderBy?: UserLlmSettingsOrderByWithRelationInput | UserLlmSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserLlmSettings.
     */
    cursor?: UserLlmSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLlmSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLlmSettings.
     */
    skip?: number
    distinct?: UserLlmSettingsScalarFieldEnum | UserLlmSettingsScalarFieldEnum[]
  }

  /**
   * UserLlmSettings create
   */
  export type UserLlmSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsInclude<ExtArgs> | null
    /**
     * The data needed to create a UserLlmSettings.
     */
    data: XOR<UserLlmSettingsCreateInput, UserLlmSettingsUncheckedCreateInput>
  }

  /**
   * UserLlmSettings createMany
   */
  export type UserLlmSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserLlmSettings.
     */
    data: UserLlmSettingsCreateManyInput | UserLlmSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserLlmSettings createManyAndReturn
   */
  export type UserLlmSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many UserLlmSettings.
     */
    data: UserLlmSettingsCreateManyInput | UserLlmSettingsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserLlmSettings update
   */
  export type UserLlmSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsInclude<ExtArgs> | null
    /**
     * The data needed to update a UserLlmSettings.
     */
    data: XOR<UserLlmSettingsUpdateInput, UserLlmSettingsUncheckedUpdateInput>
    /**
     * Choose, which UserLlmSettings to update.
     */
    where: UserLlmSettingsWhereUniqueInput
  }

  /**
   * UserLlmSettings updateMany
   */
  export type UserLlmSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserLlmSettings.
     */
    data: XOR<UserLlmSettingsUpdateManyMutationInput, UserLlmSettingsUncheckedUpdateManyInput>
    /**
     * Filter which UserLlmSettings to update
     */
    where?: UserLlmSettingsWhereInput
    /**
     * Limit how many UserLlmSettings to update.
     */
    limit?: number
  }

  /**
   * UserLlmSettings updateManyAndReturn
   */
  export type UserLlmSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * The data used to update UserLlmSettings.
     */
    data: XOR<UserLlmSettingsUpdateManyMutationInput, UserLlmSettingsUncheckedUpdateManyInput>
    /**
     * Filter which UserLlmSettings to update
     */
    where?: UserLlmSettingsWhereInput
    /**
     * Limit how many UserLlmSettings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserLlmSettings upsert
   */
  export type UserLlmSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsInclude<ExtArgs> | null
    /**
     * The filter to search for the UserLlmSettings to update in case it exists.
     */
    where: UserLlmSettingsWhereUniqueInput
    /**
     * In case the UserLlmSettings found by the `where` argument doesn't exist, create a new UserLlmSettings with this data.
     */
    create: XOR<UserLlmSettingsCreateInput, UserLlmSettingsUncheckedCreateInput>
    /**
     * In case the UserLlmSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserLlmSettingsUpdateInput, UserLlmSettingsUncheckedUpdateInput>
  }

  /**
   * UserLlmSettings delete
   */
  export type UserLlmSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsInclude<ExtArgs> | null
    /**
     * Filter which UserLlmSettings to delete.
     */
    where: UserLlmSettingsWhereUniqueInput
  }

  /**
   * UserLlmSettings deleteMany
   */
  export type UserLlmSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserLlmSettings to delete
     */
    where?: UserLlmSettingsWhereInput
    /**
     * Limit how many UserLlmSettings to delete.
     */
    limit?: number
  }

  /**
   * UserLlmSettings without action
   */
  export type UserLlmSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLlmSettings
     */
    select?: UserLlmSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLlmSettings
     */
    omit?: UserLlmSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLlmSettingsInclude<ExtArgs> | null
  }


  /**
   * Model Dictionary
   */

  export type AggregateDictionary = {
    _count: DictionaryCountAggregateOutputType | null
    _avg: DictionaryAvgAggregateOutputType | null
    _sum: DictionarySumAggregateOutputType | null
    _min: DictionaryMinAggregateOutputType | null
    _max: DictionaryMaxAggregateOutputType | null
  }

  export type DictionaryAvgAggregateOutputType = {
    id: number | null
    frequency: number | null
  }

  export type DictionarySumAggregateOutputType = {
    id: number | null
    frequency: number | null
  }

  export type DictionaryMinAggregateOutputType = {
    id: number | null
    userId: string | null
    word: string | null
    category: string | null
    frequency: number | null
    addedAt: Date | null
  }

  export type DictionaryMaxAggregateOutputType = {
    id: number | null
    userId: string | null
    word: string | null
    category: string | null
    frequency: number | null
    addedAt: Date | null
  }

  export type DictionaryCountAggregateOutputType = {
    id: number
    userId: number
    word: number
    category: number
    frequency: number
    addedAt: number
    _all: number
  }


  export type DictionaryAvgAggregateInputType = {
    id?: true
    frequency?: true
  }

  export type DictionarySumAggregateInputType = {
    id?: true
    frequency?: true
  }

  export type DictionaryMinAggregateInputType = {
    id?: true
    userId?: true
    word?: true
    category?: true
    frequency?: true
    addedAt?: true
  }

  export type DictionaryMaxAggregateInputType = {
    id?: true
    userId?: true
    word?: true
    category?: true
    frequency?: true
    addedAt?: true
  }

  export type DictionaryCountAggregateInputType = {
    id?: true
    userId?: true
    word?: true
    category?: true
    frequency?: true
    addedAt?: true
    _all?: true
  }

  export type DictionaryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dictionary to aggregate.
     */
    where?: DictionaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dictionaries to fetch.
     */
    orderBy?: DictionaryOrderByWithRelationInput | DictionaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DictionaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dictionaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dictionaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Dictionaries
    **/
    _count?: true | DictionaryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DictionaryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DictionarySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DictionaryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DictionaryMaxAggregateInputType
  }

  export type GetDictionaryAggregateType<T extends DictionaryAggregateArgs> = {
        [P in keyof T & keyof AggregateDictionary]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDictionary[P]>
      : GetScalarType<T[P], AggregateDictionary[P]>
  }




  export type DictionaryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DictionaryWhereInput
    orderBy?: DictionaryOrderByWithAggregationInput | DictionaryOrderByWithAggregationInput[]
    by: DictionaryScalarFieldEnum[] | DictionaryScalarFieldEnum
    having?: DictionaryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DictionaryCountAggregateInputType | true
    _avg?: DictionaryAvgAggregateInputType
    _sum?: DictionarySumAggregateInputType
    _min?: DictionaryMinAggregateInputType
    _max?: DictionaryMaxAggregateInputType
  }

  export type DictionaryGroupByOutputType = {
    id: number
    userId: string
    word: string
    category: string
    frequency: number
    addedAt: Date
    _count: DictionaryCountAggregateOutputType | null
    _avg: DictionaryAvgAggregateOutputType | null
    _sum: DictionarySumAggregateOutputType | null
    _min: DictionaryMinAggregateOutputType | null
    _max: DictionaryMaxAggregateOutputType | null
  }

  type GetDictionaryGroupByPayload<T extends DictionaryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DictionaryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DictionaryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DictionaryGroupByOutputType[P]>
            : GetScalarType<T[P], DictionaryGroupByOutputType[P]>
        }
      >
    >


  export type DictionarySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    word?: boolean
    category?: boolean
    frequency?: boolean
    addedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dictionary"]>

  export type DictionarySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    word?: boolean
    category?: boolean
    frequency?: boolean
    addedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dictionary"]>

  export type DictionarySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    word?: boolean
    category?: boolean
    frequency?: boolean
    addedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dictionary"]>

  export type DictionarySelectScalar = {
    id?: boolean
    userId?: boolean
    word?: boolean
    category?: boolean
    frequency?: boolean
    addedAt?: boolean
  }

  export type DictionaryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "word" | "category" | "frequency" | "addedAt", ExtArgs["result"]["dictionary"]>
  export type DictionaryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DictionaryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DictionaryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DictionaryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Dictionary"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: string
      word: string
      category: string
      frequency: number
      addedAt: Date
    }, ExtArgs["result"]["dictionary"]>
    composites: {}
  }

  type DictionaryGetPayload<S extends boolean | null | undefined | DictionaryDefaultArgs> = $Result.GetResult<Prisma.$DictionaryPayload, S>

  type DictionaryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DictionaryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DictionaryCountAggregateInputType | true
    }

  export interface DictionaryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Dictionary'], meta: { name: 'Dictionary' } }
    /**
     * Find zero or one Dictionary that matches the filter.
     * @param {DictionaryFindUniqueArgs} args - Arguments to find a Dictionary
     * @example
     * // Get one Dictionary
     * const dictionary = await prisma.dictionary.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DictionaryFindUniqueArgs>(args: SelectSubset<T, DictionaryFindUniqueArgs<ExtArgs>>): Prisma__DictionaryClient<$Result.GetResult<Prisma.$DictionaryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Dictionary that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DictionaryFindUniqueOrThrowArgs} args - Arguments to find a Dictionary
     * @example
     * // Get one Dictionary
     * const dictionary = await prisma.dictionary.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DictionaryFindUniqueOrThrowArgs>(args: SelectSubset<T, DictionaryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DictionaryClient<$Result.GetResult<Prisma.$DictionaryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dictionary that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictionaryFindFirstArgs} args - Arguments to find a Dictionary
     * @example
     * // Get one Dictionary
     * const dictionary = await prisma.dictionary.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DictionaryFindFirstArgs>(args?: SelectSubset<T, DictionaryFindFirstArgs<ExtArgs>>): Prisma__DictionaryClient<$Result.GetResult<Prisma.$DictionaryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dictionary that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictionaryFindFirstOrThrowArgs} args - Arguments to find a Dictionary
     * @example
     * // Get one Dictionary
     * const dictionary = await prisma.dictionary.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DictionaryFindFirstOrThrowArgs>(args?: SelectSubset<T, DictionaryFindFirstOrThrowArgs<ExtArgs>>): Prisma__DictionaryClient<$Result.GetResult<Prisma.$DictionaryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Dictionaries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictionaryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dictionaries
     * const dictionaries = await prisma.dictionary.findMany()
     * 
     * // Get first 10 Dictionaries
     * const dictionaries = await prisma.dictionary.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dictionaryWithIdOnly = await prisma.dictionary.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DictionaryFindManyArgs>(args?: SelectSubset<T, DictionaryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DictionaryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Dictionary.
     * @param {DictionaryCreateArgs} args - Arguments to create a Dictionary.
     * @example
     * // Create one Dictionary
     * const Dictionary = await prisma.dictionary.create({
     *   data: {
     *     // ... data to create a Dictionary
     *   }
     * })
     * 
     */
    create<T extends DictionaryCreateArgs>(args: SelectSubset<T, DictionaryCreateArgs<ExtArgs>>): Prisma__DictionaryClient<$Result.GetResult<Prisma.$DictionaryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Dictionaries.
     * @param {DictionaryCreateManyArgs} args - Arguments to create many Dictionaries.
     * @example
     * // Create many Dictionaries
     * const dictionary = await prisma.dictionary.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DictionaryCreateManyArgs>(args?: SelectSubset<T, DictionaryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Dictionaries and returns the data saved in the database.
     * @param {DictionaryCreateManyAndReturnArgs} args - Arguments to create many Dictionaries.
     * @example
     * // Create many Dictionaries
     * const dictionary = await prisma.dictionary.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Dictionaries and only return the `id`
     * const dictionaryWithIdOnly = await prisma.dictionary.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DictionaryCreateManyAndReturnArgs>(args?: SelectSubset<T, DictionaryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DictionaryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Dictionary.
     * @param {DictionaryDeleteArgs} args - Arguments to delete one Dictionary.
     * @example
     * // Delete one Dictionary
     * const Dictionary = await prisma.dictionary.delete({
     *   where: {
     *     // ... filter to delete one Dictionary
     *   }
     * })
     * 
     */
    delete<T extends DictionaryDeleteArgs>(args: SelectSubset<T, DictionaryDeleteArgs<ExtArgs>>): Prisma__DictionaryClient<$Result.GetResult<Prisma.$DictionaryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Dictionary.
     * @param {DictionaryUpdateArgs} args - Arguments to update one Dictionary.
     * @example
     * // Update one Dictionary
     * const dictionary = await prisma.dictionary.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DictionaryUpdateArgs>(args: SelectSubset<T, DictionaryUpdateArgs<ExtArgs>>): Prisma__DictionaryClient<$Result.GetResult<Prisma.$DictionaryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Dictionaries.
     * @param {DictionaryDeleteManyArgs} args - Arguments to filter Dictionaries to delete.
     * @example
     * // Delete a few Dictionaries
     * const { count } = await prisma.dictionary.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DictionaryDeleteManyArgs>(args?: SelectSubset<T, DictionaryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dictionaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictionaryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dictionaries
     * const dictionary = await prisma.dictionary.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DictionaryUpdateManyArgs>(args: SelectSubset<T, DictionaryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dictionaries and returns the data updated in the database.
     * @param {DictionaryUpdateManyAndReturnArgs} args - Arguments to update many Dictionaries.
     * @example
     * // Update many Dictionaries
     * const dictionary = await prisma.dictionary.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Dictionaries and only return the `id`
     * const dictionaryWithIdOnly = await prisma.dictionary.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DictionaryUpdateManyAndReturnArgs>(args: SelectSubset<T, DictionaryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DictionaryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Dictionary.
     * @param {DictionaryUpsertArgs} args - Arguments to update or create a Dictionary.
     * @example
     * // Update or create a Dictionary
     * const dictionary = await prisma.dictionary.upsert({
     *   create: {
     *     // ... data to create a Dictionary
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dictionary we want to update
     *   }
     * })
     */
    upsert<T extends DictionaryUpsertArgs>(args: SelectSubset<T, DictionaryUpsertArgs<ExtArgs>>): Prisma__DictionaryClient<$Result.GetResult<Prisma.$DictionaryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Dictionaries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictionaryCountArgs} args - Arguments to filter Dictionaries to count.
     * @example
     * // Count the number of Dictionaries
     * const count = await prisma.dictionary.count({
     *   where: {
     *     // ... the filter for the Dictionaries we want to count
     *   }
     * })
    **/
    count<T extends DictionaryCountArgs>(
      args?: Subset<T, DictionaryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DictionaryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dictionary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictionaryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DictionaryAggregateArgs>(args: Subset<T, DictionaryAggregateArgs>): Prisma.PrismaPromise<GetDictionaryAggregateType<T>>

    /**
     * Group by Dictionary.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictionaryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DictionaryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DictionaryGroupByArgs['orderBy'] }
        : { orderBy?: DictionaryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DictionaryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDictionaryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Dictionary model
   */
  readonly fields: DictionaryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Dictionary.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DictionaryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Dictionary model
   */
  interface DictionaryFieldRefs {
    readonly id: FieldRef<"Dictionary", 'Int'>
    readonly userId: FieldRef<"Dictionary", 'String'>
    readonly word: FieldRef<"Dictionary", 'String'>
    readonly category: FieldRef<"Dictionary", 'String'>
    readonly frequency: FieldRef<"Dictionary", 'Int'>
    readonly addedAt: FieldRef<"Dictionary", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Dictionary findUnique
   */
  export type DictionaryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryInclude<ExtArgs> | null
    /**
     * Filter, which Dictionary to fetch.
     */
    where: DictionaryWhereUniqueInput
  }

  /**
   * Dictionary findUniqueOrThrow
   */
  export type DictionaryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryInclude<ExtArgs> | null
    /**
     * Filter, which Dictionary to fetch.
     */
    where: DictionaryWhereUniqueInput
  }

  /**
   * Dictionary findFirst
   */
  export type DictionaryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryInclude<ExtArgs> | null
    /**
     * Filter, which Dictionary to fetch.
     */
    where?: DictionaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dictionaries to fetch.
     */
    orderBy?: DictionaryOrderByWithRelationInput | DictionaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dictionaries.
     */
    cursor?: DictionaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dictionaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dictionaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dictionaries.
     */
    distinct?: DictionaryScalarFieldEnum | DictionaryScalarFieldEnum[]
  }

  /**
   * Dictionary findFirstOrThrow
   */
  export type DictionaryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryInclude<ExtArgs> | null
    /**
     * Filter, which Dictionary to fetch.
     */
    where?: DictionaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dictionaries to fetch.
     */
    orderBy?: DictionaryOrderByWithRelationInput | DictionaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dictionaries.
     */
    cursor?: DictionaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dictionaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dictionaries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dictionaries.
     */
    distinct?: DictionaryScalarFieldEnum | DictionaryScalarFieldEnum[]
  }

  /**
   * Dictionary findMany
   */
  export type DictionaryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryInclude<ExtArgs> | null
    /**
     * Filter, which Dictionaries to fetch.
     */
    where?: DictionaryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dictionaries to fetch.
     */
    orderBy?: DictionaryOrderByWithRelationInput | DictionaryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Dictionaries.
     */
    cursor?: DictionaryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dictionaries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dictionaries.
     */
    skip?: number
    distinct?: DictionaryScalarFieldEnum | DictionaryScalarFieldEnum[]
  }

  /**
   * Dictionary create
   */
  export type DictionaryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryInclude<ExtArgs> | null
    /**
     * The data needed to create a Dictionary.
     */
    data: XOR<DictionaryCreateInput, DictionaryUncheckedCreateInput>
  }

  /**
   * Dictionary createMany
   */
  export type DictionaryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Dictionaries.
     */
    data: DictionaryCreateManyInput | DictionaryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Dictionary createManyAndReturn
   */
  export type DictionaryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * The data used to create many Dictionaries.
     */
    data: DictionaryCreateManyInput | DictionaryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Dictionary update
   */
  export type DictionaryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryInclude<ExtArgs> | null
    /**
     * The data needed to update a Dictionary.
     */
    data: XOR<DictionaryUpdateInput, DictionaryUncheckedUpdateInput>
    /**
     * Choose, which Dictionary to update.
     */
    where: DictionaryWhereUniqueInput
  }

  /**
   * Dictionary updateMany
   */
  export type DictionaryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Dictionaries.
     */
    data: XOR<DictionaryUpdateManyMutationInput, DictionaryUncheckedUpdateManyInput>
    /**
     * Filter which Dictionaries to update
     */
    where?: DictionaryWhereInput
    /**
     * Limit how many Dictionaries to update.
     */
    limit?: number
  }

  /**
   * Dictionary updateManyAndReturn
   */
  export type DictionaryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * The data used to update Dictionaries.
     */
    data: XOR<DictionaryUpdateManyMutationInput, DictionaryUncheckedUpdateManyInput>
    /**
     * Filter which Dictionaries to update
     */
    where?: DictionaryWhereInput
    /**
     * Limit how many Dictionaries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Dictionary upsert
   */
  export type DictionaryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryInclude<ExtArgs> | null
    /**
     * The filter to search for the Dictionary to update in case it exists.
     */
    where: DictionaryWhereUniqueInput
    /**
     * In case the Dictionary found by the `where` argument doesn't exist, create a new Dictionary with this data.
     */
    create: XOR<DictionaryCreateInput, DictionaryUncheckedCreateInput>
    /**
     * In case the Dictionary was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DictionaryUpdateInput, DictionaryUncheckedUpdateInput>
  }

  /**
   * Dictionary delete
   */
  export type DictionaryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryInclude<ExtArgs> | null
    /**
     * Filter which Dictionary to delete.
     */
    where: DictionaryWhereUniqueInput
  }

  /**
   * Dictionary deleteMany
   */
  export type DictionaryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dictionaries to delete
     */
    where?: DictionaryWhereInput
    /**
     * Limit how many Dictionaries to delete.
     */
    limit?: number
  }

  /**
   * Dictionary without action
   */
  export type DictionaryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictionary
     */
    select?: DictionarySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictionary
     */
    omit?: DictionaryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictionaryInclude<ExtArgs> | null
  }


  /**
   * Model Snippet
   */

  export type AggregateSnippet = {
    _count: SnippetCountAggregateOutputType | null
    _min: SnippetMinAggregateOutputType | null
    _max: SnippetMaxAggregateOutputType | null
  }

  export type SnippetMinAggregateOutputType = {
    id: string | null
    userId: string | null
    trigger: string | null
    replacement: string | null
    category: string | null
    createdAt: Date | null
  }

  export type SnippetMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    trigger: string | null
    replacement: string | null
    category: string | null
    createdAt: Date | null
  }

  export type SnippetCountAggregateOutputType = {
    id: number
    userId: number
    trigger: number
    replacement: number
    category: number
    createdAt: number
    _all: number
  }


  export type SnippetMinAggregateInputType = {
    id?: true
    userId?: true
    trigger?: true
    replacement?: true
    category?: true
    createdAt?: true
  }

  export type SnippetMaxAggregateInputType = {
    id?: true
    userId?: true
    trigger?: true
    replacement?: true
    category?: true
    createdAt?: true
  }

  export type SnippetCountAggregateInputType = {
    id?: true
    userId?: true
    trigger?: true
    replacement?: true
    category?: true
    createdAt?: true
    _all?: true
  }

  export type SnippetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Snippet to aggregate.
     */
    where?: SnippetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snippets to fetch.
     */
    orderBy?: SnippetOrderByWithRelationInput | SnippetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SnippetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snippets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snippets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Snippets
    **/
    _count?: true | SnippetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SnippetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SnippetMaxAggregateInputType
  }

  export type GetSnippetAggregateType<T extends SnippetAggregateArgs> = {
        [P in keyof T & keyof AggregateSnippet]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSnippet[P]>
      : GetScalarType<T[P], AggregateSnippet[P]>
  }




  export type SnippetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SnippetWhereInput
    orderBy?: SnippetOrderByWithAggregationInput | SnippetOrderByWithAggregationInput[]
    by: SnippetScalarFieldEnum[] | SnippetScalarFieldEnum
    having?: SnippetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SnippetCountAggregateInputType | true
    _min?: SnippetMinAggregateInputType
    _max?: SnippetMaxAggregateInputType
  }

  export type SnippetGroupByOutputType = {
    id: string
    userId: string
    trigger: string
    replacement: string
    category: string
    createdAt: Date
    _count: SnippetCountAggregateOutputType | null
    _min: SnippetMinAggregateOutputType | null
    _max: SnippetMaxAggregateOutputType | null
  }

  type GetSnippetGroupByPayload<T extends SnippetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SnippetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SnippetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SnippetGroupByOutputType[P]>
            : GetScalarType<T[P], SnippetGroupByOutputType[P]>
        }
      >
    >


  export type SnippetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    trigger?: boolean
    replacement?: boolean
    category?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["snippet"]>

  export type SnippetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    trigger?: boolean
    replacement?: boolean
    category?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["snippet"]>

  export type SnippetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    trigger?: boolean
    replacement?: boolean
    category?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["snippet"]>

  export type SnippetSelectScalar = {
    id?: boolean
    userId?: boolean
    trigger?: boolean
    replacement?: boolean
    category?: boolean
    createdAt?: boolean
  }

  export type SnippetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "trigger" | "replacement" | "category" | "createdAt", ExtArgs["result"]["snippet"]>
  export type SnippetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SnippetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SnippetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SnippetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Snippet"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      trigger: string
      replacement: string
      category: string
      createdAt: Date
    }, ExtArgs["result"]["snippet"]>
    composites: {}
  }

  type SnippetGetPayload<S extends boolean | null | undefined | SnippetDefaultArgs> = $Result.GetResult<Prisma.$SnippetPayload, S>

  type SnippetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SnippetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SnippetCountAggregateInputType | true
    }

  export interface SnippetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Snippet'], meta: { name: 'Snippet' } }
    /**
     * Find zero or one Snippet that matches the filter.
     * @param {SnippetFindUniqueArgs} args - Arguments to find a Snippet
     * @example
     * // Get one Snippet
     * const snippet = await prisma.snippet.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SnippetFindUniqueArgs>(args: SelectSubset<T, SnippetFindUniqueArgs<ExtArgs>>): Prisma__SnippetClient<$Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Snippet that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SnippetFindUniqueOrThrowArgs} args - Arguments to find a Snippet
     * @example
     * // Get one Snippet
     * const snippet = await prisma.snippet.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SnippetFindUniqueOrThrowArgs>(args: SelectSubset<T, SnippetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SnippetClient<$Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Snippet that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnippetFindFirstArgs} args - Arguments to find a Snippet
     * @example
     * // Get one Snippet
     * const snippet = await prisma.snippet.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SnippetFindFirstArgs>(args?: SelectSubset<T, SnippetFindFirstArgs<ExtArgs>>): Prisma__SnippetClient<$Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Snippet that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnippetFindFirstOrThrowArgs} args - Arguments to find a Snippet
     * @example
     * // Get one Snippet
     * const snippet = await prisma.snippet.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SnippetFindFirstOrThrowArgs>(args?: SelectSubset<T, SnippetFindFirstOrThrowArgs<ExtArgs>>): Prisma__SnippetClient<$Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Snippets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnippetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Snippets
     * const snippets = await prisma.snippet.findMany()
     * 
     * // Get first 10 Snippets
     * const snippets = await prisma.snippet.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const snippetWithIdOnly = await prisma.snippet.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SnippetFindManyArgs>(args?: SelectSubset<T, SnippetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Snippet.
     * @param {SnippetCreateArgs} args - Arguments to create a Snippet.
     * @example
     * // Create one Snippet
     * const Snippet = await prisma.snippet.create({
     *   data: {
     *     // ... data to create a Snippet
     *   }
     * })
     * 
     */
    create<T extends SnippetCreateArgs>(args: SelectSubset<T, SnippetCreateArgs<ExtArgs>>): Prisma__SnippetClient<$Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Snippets.
     * @param {SnippetCreateManyArgs} args - Arguments to create many Snippets.
     * @example
     * // Create many Snippets
     * const snippet = await prisma.snippet.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SnippetCreateManyArgs>(args?: SelectSubset<T, SnippetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Snippets and returns the data saved in the database.
     * @param {SnippetCreateManyAndReturnArgs} args - Arguments to create many Snippets.
     * @example
     * // Create many Snippets
     * const snippet = await prisma.snippet.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Snippets and only return the `id`
     * const snippetWithIdOnly = await prisma.snippet.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SnippetCreateManyAndReturnArgs>(args?: SelectSubset<T, SnippetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Snippet.
     * @param {SnippetDeleteArgs} args - Arguments to delete one Snippet.
     * @example
     * // Delete one Snippet
     * const Snippet = await prisma.snippet.delete({
     *   where: {
     *     // ... filter to delete one Snippet
     *   }
     * })
     * 
     */
    delete<T extends SnippetDeleteArgs>(args: SelectSubset<T, SnippetDeleteArgs<ExtArgs>>): Prisma__SnippetClient<$Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Snippet.
     * @param {SnippetUpdateArgs} args - Arguments to update one Snippet.
     * @example
     * // Update one Snippet
     * const snippet = await prisma.snippet.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SnippetUpdateArgs>(args: SelectSubset<T, SnippetUpdateArgs<ExtArgs>>): Prisma__SnippetClient<$Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Snippets.
     * @param {SnippetDeleteManyArgs} args - Arguments to filter Snippets to delete.
     * @example
     * // Delete a few Snippets
     * const { count } = await prisma.snippet.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SnippetDeleteManyArgs>(args?: SelectSubset<T, SnippetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Snippets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnippetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Snippets
     * const snippet = await prisma.snippet.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SnippetUpdateManyArgs>(args: SelectSubset<T, SnippetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Snippets and returns the data updated in the database.
     * @param {SnippetUpdateManyAndReturnArgs} args - Arguments to update many Snippets.
     * @example
     * // Update many Snippets
     * const snippet = await prisma.snippet.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Snippets and only return the `id`
     * const snippetWithIdOnly = await prisma.snippet.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SnippetUpdateManyAndReturnArgs>(args: SelectSubset<T, SnippetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Snippet.
     * @param {SnippetUpsertArgs} args - Arguments to update or create a Snippet.
     * @example
     * // Update or create a Snippet
     * const snippet = await prisma.snippet.upsert({
     *   create: {
     *     // ... data to create a Snippet
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Snippet we want to update
     *   }
     * })
     */
    upsert<T extends SnippetUpsertArgs>(args: SelectSubset<T, SnippetUpsertArgs<ExtArgs>>): Prisma__SnippetClient<$Result.GetResult<Prisma.$SnippetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Snippets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnippetCountArgs} args - Arguments to filter Snippets to count.
     * @example
     * // Count the number of Snippets
     * const count = await prisma.snippet.count({
     *   where: {
     *     // ... the filter for the Snippets we want to count
     *   }
     * })
    **/
    count<T extends SnippetCountArgs>(
      args?: Subset<T, SnippetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SnippetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Snippet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnippetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SnippetAggregateArgs>(args: Subset<T, SnippetAggregateArgs>): Prisma.PrismaPromise<GetSnippetAggregateType<T>>

    /**
     * Group by Snippet.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SnippetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SnippetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SnippetGroupByArgs['orderBy'] }
        : { orderBy?: SnippetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SnippetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSnippetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Snippet model
   */
  readonly fields: SnippetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Snippet.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SnippetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Snippet model
   */
  interface SnippetFieldRefs {
    readonly id: FieldRef<"Snippet", 'String'>
    readonly userId: FieldRef<"Snippet", 'String'>
    readonly trigger: FieldRef<"Snippet", 'String'>
    readonly replacement: FieldRef<"Snippet", 'String'>
    readonly category: FieldRef<"Snippet", 'String'>
    readonly createdAt: FieldRef<"Snippet", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Snippet findUnique
   */
  export type SnippetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetInclude<ExtArgs> | null
    /**
     * Filter, which Snippet to fetch.
     */
    where: SnippetWhereUniqueInput
  }

  /**
   * Snippet findUniqueOrThrow
   */
  export type SnippetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetInclude<ExtArgs> | null
    /**
     * Filter, which Snippet to fetch.
     */
    where: SnippetWhereUniqueInput
  }

  /**
   * Snippet findFirst
   */
  export type SnippetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetInclude<ExtArgs> | null
    /**
     * Filter, which Snippet to fetch.
     */
    where?: SnippetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snippets to fetch.
     */
    orderBy?: SnippetOrderByWithRelationInput | SnippetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Snippets.
     */
    cursor?: SnippetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snippets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snippets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Snippets.
     */
    distinct?: SnippetScalarFieldEnum | SnippetScalarFieldEnum[]
  }

  /**
   * Snippet findFirstOrThrow
   */
  export type SnippetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetInclude<ExtArgs> | null
    /**
     * Filter, which Snippet to fetch.
     */
    where?: SnippetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snippets to fetch.
     */
    orderBy?: SnippetOrderByWithRelationInput | SnippetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Snippets.
     */
    cursor?: SnippetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snippets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snippets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Snippets.
     */
    distinct?: SnippetScalarFieldEnum | SnippetScalarFieldEnum[]
  }

  /**
   * Snippet findMany
   */
  export type SnippetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetInclude<ExtArgs> | null
    /**
     * Filter, which Snippets to fetch.
     */
    where?: SnippetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Snippets to fetch.
     */
    orderBy?: SnippetOrderByWithRelationInput | SnippetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Snippets.
     */
    cursor?: SnippetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Snippets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Snippets.
     */
    skip?: number
    distinct?: SnippetScalarFieldEnum | SnippetScalarFieldEnum[]
  }

  /**
   * Snippet create
   */
  export type SnippetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetInclude<ExtArgs> | null
    /**
     * The data needed to create a Snippet.
     */
    data: XOR<SnippetCreateInput, SnippetUncheckedCreateInput>
  }

  /**
   * Snippet createMany
   */
  export type SnippetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Snippets.
     */
    data: SnippetCreateManyInput | SnippetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Snippet createManyAndReturn
   */
  export type SnippetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * The data used to create many Snippets.
     */
    data: SnippetCreateManyInput | SnippetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Snippet update
   */
  export type SnippetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetInclude<ExtArgs> | null
    /**
     * The data needed to update a Snippet.
     */
    data: XOR<SnippetUpdateInput, SnippetUncheckedUpdateInput>
    /**
     * Choose, which Snippet to update.
     */
    where: SnippetWhereUniqueInput
  }

  /**
   * Snippet updateMany
   */
  export type SnippetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Snippets.
     */
    data: XOR<SnippetUpdateManyMutationInput, SnippetUncheckedUpdateManyInput>
    /**
     * Filter which Snippets to update
     */
    where?: SnippetWhereInput
    /**
     * Limit how many Snippets to update.
     */
    limit?: number
  }

  /**
   * Snippet updateManyAndReturn
   */
  export type SnippetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * The data used to update Snippets.
     */
    data: XOR<SnippetUpdateManyMutationInput, SnippetUncheckedUpdateManyInput>
    /**
     * Filter which Snippets to update
     */
    where?: SnippetWhereInput
    /**
     * Limit how many Snippets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Snippet upsert
   */
  export type SnippetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetInclude<ExtArgs> | null
    /**
     * The filter to search for the Snippet to update in case it exists.
     */
    where: SnippetWhereUniqueInput
    /**
     * In case the Snippet found by the `where` argument doesn't exist, create a new Snippet with this data.
     */
    create: XOR<SnippetCreateInput, SnippetUncheckedCreateInput>
    /**
     * In case the Snippet was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SnippetUpdateInput, SnippetUncheckedUpdateInput>
  }

  /**
   * Snippet delete
   */
  export type SnippetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetInclude<ExtArgs> | null
    /**
     * Filter which Snippet to delete.
     */
    where: SnippetWhereUniqueInput
  }

  /**
   * Snippet deleteMany
   */
  export type SnippetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Snippets to delete
     */
    where?: SnippetWhereInput
    /**
     * Limit how many Snippets to delete.
     */
    limit?: number
  }

  /**
   * Snippet without action
   */
  export type SnippetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Snippet
     */
    select?: SnippetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Snippet
     */
    omit?: SnippetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SnippetInclude<ExtArgs> | null
  }


  /**
   * Model Dictation
   */

  export type AggregateDictation = {
    _count: DictationCountAggregateOutputType | null
    _avg: DictationAvgAggregateOutputType | null
    _sum: DictationSumAggregateOutputType | null
    _min: DictationMinAggregateOutputType | null
    _max: DictationMaxAggregateOutputType | null
  }

  export type DictationAvgAggregateOutputType = {
    charCount: number | null
  }

  export type DictationSumAggregateOutputType = {
    charCount: number | null
  }

  export type DictationMinAggregateOutputType = {
    id: string | null
    userId: string | null
    text: string | null
    language: string | null
    charCount: number | null
    createdAt: Date | null
  }

  export type DictationMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    text: string | null
    language: string | null
    charCount: number | null
    createdAt: Date | null
  }

  export type DictationCountAggregateOutputType = {
    id: number
    userId: number
    text: number
    language: number
    charCount: number
    createdAt: number
    _all: number
  }


  export type DictationAvgAggregateInputType = {
    charCount?: true
  }

  export type DictationSumAggregateInputType = {
    charCount?: true
  }

  export type DictationMinAggregateInputType = {
    id?: true
    userId?: true
    text?: true
    language?: true
    charCount?: true
    createdAt?: true
  }

  export type DictationMaxAggregateInputType = {
    id?: true
    userId?: true
    text?: true
    language?: true
    charCount?: true
    createdAt?: true
  }

  export type DictationCountAggregateInputType = {
    id?: true
    userId?: true
    text?: true
    language?: true
    charCount?: true
    createdAt?: true
    _all?: true
  }

  export type DictationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dictation to aggregate.
     */
    where?: DictationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dictations to fetch.
     */
    orderBy?: DictationOrderByWithRelationInput | DictationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DictationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dictations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dictations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Dictations
    **/
    _count?: true | DictationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DictationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DictationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DictationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DictationMaxAggregateInputType
  }

  export type GetDictationAggregateType<T extends DictationAggregateArgs> = {
        [P in keyof T & keyof AggregateDictation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDictation[P]>
      : GetScalarType<T[P], AggregateDictation[P]>
  }




  export type DictationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DictationWhereInput
    orderBy?: DictationOrderByWithAggregationInput | DictationOrderByWithAggregationInput[]
    by: DictationScalarFieldEnum[] | DictationScalarFieldEnum
    having?: DictationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DictationCountAggregateInputType | true
    _avg?: DictationAvgAggregateInputType
    _sum?: DictationSumAggregateInputType
    _min?: DictationMinAggregateInputType
    _max?: DictationMaxAggregateInputType
  }

  export type DictationGroupByOutputType = {
    id: string
    userId: string | null
    text: string
    language: string
    charCount: number
    createdAt: Date
    _count: DictationCountAggregateOutputType | null
    _avg: DictationAvgAggregateOutputType | null
    _sum: DictationSumAggregateOutputType | null
    _min: DictationMinAggregateOutputType | null
    _max: DictationMaxAggregateOutputType | null
  }

  type GetDictationGroupByPayload<T extends DictationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DictationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DictationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DictationGroupByOutputType[P]>
            : GetScalarType<T[P], DictationGroupByOutputType[P]>
        }
      >
    >


  export type DictationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    text?: boolean
    language?: boolean
    charCount?: boolean
    createdAt?: boolean
    user?: boolean | Dictation$userArgs<ExtArgs>
  }, ExtArgs["result"]["dictation"]>

  export type DictationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    text?: boolean
    language?: boolean
    charCount?: boolean
    createdAt?: boolean
    user?: boolean | Dictation$userArgs<ExtArgs>
  }, ExtArgs["result"]["dictation"]>

  export type DictationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    text?: boolean
    language?: boolean
    charCount?: boolean
    createdAt?: boolean
    user?: boolean | Dictation$userArgs<ExtArgs>
  }, ExtArgs["result"]["dictation"]>

  export type DictationSelectScalar = {
    id?: boolean
    userId?: boolean
    text?: boolean
    language?: boolean
    charCount?: boolean
    createdAt?: boolean
  }

  export type DictationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "text" | "language" | "charCount" | "createdAt", ExtArgs["result"]["dictation"]>
  export type DictationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Dictation$userArgs<ExtArgs>
  }
  export type DictationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Dictation$userArgs<ExtArgs>
  }
  export type DictationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | Dictation$userArgs<ExtArgs>
  }

  export type $DictationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Dictation"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string | null
      text: string
      language: string
      charCount: number
      createdAt: Date
    }, ExtArgs["result"]["dictation"]>
    composites: {}
  }

  type DictationGetPayload<S extends boolean | null | undefined | DictationDefaultArgs> = $Result.GetResult<Prisma.$DictationPayload, S>

  type DictationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DictationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DictationCountAggregateInputType | true
    }

  export interface DictationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Dictation'], meta: { name: 'Dictation' } }
    /**
     * Find zero or one Dictation that matches the filter.
     * @param {DictationFindUniqueArgs} args - Arguments to find a Dictation
     * @example
     * // Get one Dictation
     * const dictation = await prisma.dictation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DictationFindUniqueArgs>(args: SelectSubset<T, DictationFindUniqueArgs<ExtArgs>>): Prisma__DictationClient<$Result.GetResult<Prisma.$DictationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Dictation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DictationFindUniqueOrThrowArgs} args - Arguments to find a Dictation
     * @example
     * // Get one Dictation
     * const dictation = await prisma.dictation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DictationFindUniqueOrThrowArgs>(args: SelectSubset<T, DictationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DictationClient<$Result.GetResult<Prisma.$DictationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dictation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictationFindFirstArgs} args - Arguments to find a Dictation
     * @example
     * // Get one Dictation
     * const dictation = await prisma.dictation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DictationFindFirstArgs>(args?: SelectSubset<T, DictationFindFirstArgs<ExtArgs>>): Prisma__DictationClient<$Result.GetResult<Prisma.$DictationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Dictation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictationFindFirstOrThrowArgs} args - Arguments to find a Dictation
     * @example
     * // Get one Dictation
     * const dictation = await prisma.dictation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DictationFindFirstOrThrowArgs>(args?: SelectSubset<T, DictationFindFirstOrThrowArgs<ExtArgs>>): Prisma__DictationClient<$Result.GetResult<Prisma.$DictationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Dictations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dictations
     * const dictations = await prisma.dictation.findMany()
     * 
     * // Get first 10 Dictations
     * const dictations = await prisma.dictation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dictationWithIdOnly = await prisma.dictation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DictationFindManyArgs>(args?: SelectSubset<T, DictationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DictationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Dictation.
     * @param {DictationCreateArgs} args - Arguments to create a Dictation.
     * @example
     * // Create one Dictation
     * const Dictation = await prisma.dictation.create({
     *   data: {
     *     // ... data to create a Dictation
     *   }
     * })
     * 
     */
    create<T extends DictationCreateArgs>(args: SelectSubset<T, DictationCreateArgs<ExtArgs>>): Prisma__DictationClient<$Result.GetResult<Prisma.$DictationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Dictations.
     * @param {DictationCreateManyArgs} args - Arguments to create many Dictations.
     * @example
     * // Create many Dictations
     * const dictation = await prisma.dictation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DictationCreateManyArgs>(args?: SelectSubset<T, DictationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Dictations and returns the data saved in the database.
     * @param {DictationCreateManyAndReturnArgs} args - Arguments to create many Dictations.
     * @example
     * // Create many Dictations
     * const dictation = await prisma.dictation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Dictations and only return the `id`
     * const dictationWithIdOnly = await prisma.dictation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DictationCreateManyAndReturnArgs>(args?: SelectSubset<T, DictationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DictationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Dictation.
     * @param {DictationDeleteArgs} args - Arguments to delete one Dictation.
     * @example
     * // Delete one Dictation
     * const Dictation = await prisma.dictation.delete({
     *   where: {
     *     // ... filter to delete one Dictation
     *   }
     * })
     * 
     */
    delete<T extends DictationDeleteArgs>(args: SelectSubset<T, DictationDeleteArgs<ExtArgs>>): Prisma__DictationClient<$Result.GetResult<Prisma.$DictationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Dictation.
     * @param {DictationUpdateArgs} args - Arguments to update one Dictation.
     * @example
     * // Update one Dictation
     * const dictation = await prisma.dictation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DictationUpdateArgs>(args: SelectSubset<T, DictationUpdateArgs<ExtArgs>>): Prisma__DictationClient<$Result.GetResult<Prisma.$DictationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Dictations.
     * @param {DictationDeleteManyArgs} args - Arguments to filter Dictations to delete.
     * @example
     * // Delete a few Dictations
     * const { count } = await prisma.dictation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DictationDeleteManyArgs>(args?: SelectSubset<T, DictationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dictations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dictations
     * const dictation = await prisma.dictation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DictationUpdateManyArgs>(args: SelectSubset<T, DictationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dictations and returns the data updated in the database.
     * @param {DictationUpdateManyAndReturnArgs} args - Arguments to update many Dictations.
     * @example
     * // Update many Dictations
     * const dictation = await prisma.dictation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Dictations and only return the `id`
     * const dictationWithIdOnly = await prisma.dictation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DictationUpdateManyAndReturnArgs>(args: SelectSubset<T, DictationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DictationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Dictation.
     * @param {DictationUpsertArgs} args - Arguments to update or create a Dictation.
     * @example
     * // Update or create a Dictation
     * const dictation = await prisma.dictation.upsert({
     *   create: {
     *     // ... data to create a Dictation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dictation we want to update
     *   }
     * })
     */
    upsert<T extends DictationUpsertArgs>(args: SelectSubset<T, DictationUpsertArgs<ExtArgs>>): Prisma__DictationClient<$Result.GetResult<Prisma.$DictationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Dictations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictationCountArgs} args - Arguments to filter Dictations to count.
     * @example
     * // Count the number of Dictations
     * const count = await prisma.dictation.count({
     *   where: {
     *     // ... the filter for the Dictations we want to count
     *   }
     * })
    **/
    count<T extends DictationCountArgs>(
      args?: Subset<T, DictationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DictationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dictation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DictationAggregateArgs>(args: Subset<T, DictationAggregateArgs>): Prisma.PrismaPromise<GetDictationAggregateType<T>>

    /**
     * Group by Dictation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DictationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DictationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DictationGroupByArgs['orderBy'] }
        : { orderBy?: DictationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DictationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDictationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Dictation model
   */
  readonly fields: DictationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Dictation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DictationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends Dictation$userArgs<ExtArgs> = {}>(args?: Subset<T, Dictation$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Dictation model
   */
  interface DictationFieldRefs {
    readonly id: FieldRef<"Dictation", 'String'>
    readonly userId: FieldRef<"Dictation", 'String'>
    readonly text: FieldRef<"Dictation", 'String'>
    readonly language: FieldRef<"Dictation", 'String'>
    readonly charCount: FieldRef<"Dictation", 'Int'>
    readonly createdAt: FieldRef<"Dictation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Dictation findUnique
   */
  export type DictationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationInclude<ExtArgs> | null
    /**
     * Filter, which Dictation to fetch.
     */
    where: DictationWhereUniqueInput
  }

  /**
   * Dictation findUniqueOrThrow
   */
  export type DictationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationInclude<ExtArgs> | null
    /**
     * Filter, which Dictation to fetch.
     */
    where: DictationWhereUniqueInput
  }

  /**
   * Dictation findFirst
   */
  export type DictationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationInclude<ExtArgs> | null
    /**
     * Filter, which Dictation to fetch.
     */
    where?: DictationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dictations to fetch.
     */
    orderBy?: DictationOrderByWithRelationInput | DictationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dictations.
     */
    cursor?: DictationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dictations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dictations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dictations.
     */
    distinct?: DictationScalarFieldEnum | DictationScalarFieldEnum[]
  }

  /**
   * Dictation findFirstOrThrow
   */
  export type DictationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationInclude<ExtArgs> | null
    /**
     * Filter, which Dictation to fetch.
     */
    where?: DictationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dictations to fetch.
     */
    orderBy?: DictationOrderByWithRelationInput | DictationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dictations.
     */
    cursor?: DictationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dictations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dictations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dictations.
     */
    distinct?: DictationScalarFieldEnum | DictationScalarFieldEnum[]
  }

  /**
   * Dictation findMany
   */
  export type DictationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationInclude<ExtArgs> | null
    /**
     * Filter, which Dictations to fetch.
     */
    where?: DictationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dictations to fetch.
     */
    orderBy?: DictationOrderByWithRelationInput | DictationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Dictations.
     */
    cursor?: DictationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dictations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dictations.
     */
    skip?: number
    distinct?: DictationScalarFieldEnum | DictationScalarFieldEnum[]
  }

  /**
   * Dictation create
   */
  export type DictationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationInclude<ExtArgs> | null
    /**
     * The data needed to create a Dictation.
     */
    data: XOR<DictationCreateInput, DictationUncheckedCreateInput>
  }

  /**
   * Dictation createMany
   */
  export type DictationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Dictations.
     */
    data: DictationCreateManyInput | DictationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Dictation createManyAndReturn
   */
  export type DictationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * The data used to create many Dictations.
     */
    data: DictationCreateManyInput | DictationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Dictation update
   */
  export type DictationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationInclude<ExtArgs> | null
    /**
     * The data needed to update a Dictation.
     */
    data: XOR<DictationUpdateInput, DictationUncheckedUpdateInput>
    /**
     * Choose, which Dictation to update.
     */
    where: DictationWhereUniqueInput
  }

  /**
   * Dictation updateMany
   */
  export type DictationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Dictations.
     */
    data: XOR<DictationUpdateManyMutationInput, DictationUncheckedUpdateManyInput>
    /**
     * Filter which Dictations to update
     */
    where?: DictationWhereInput
    /**
     * Limit how many Dictations to update.
     */
    limit?: number
  }

  /**
   * Dictation updateManyAndReturn
   */
  export type DictationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * The data used to update Dictations.
     */
    data: XOR<DictationUpdateManyMutationInput, DictationUncheckedUpdateManyInput>
    /**
     * Filter which Dictations to update
     */
    where?: DictationWhereInput
    /**
     * Limit how many Dictations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Dictation upsert
   */
  export type DictationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationInclude<ExtArgs> | null
    /**
     * The filter to search for the Dictation to update in case it exists.
     */
    where: DictationWhereUniqueInput
    /**
     * In case the Dictation found by the `where` argument doesn't exist, create a new Dictation with this data.
     */
    create: XOR<DictationCreateInput, DictationUncheckedCreateInput>
    /**
     * In case the Dictation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DictationUpdateInput, DictationUncheckedUpdateInput>
  }

  /**
   * Dictation delete
   */
  export type DictationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationInclude<ExtArgs> | null
    /**
     * Filter which Dictation to delete.
     */
    where: DictationWhereUniqueInput
  }

  /**
   * Dictation deleteMany
   */
  export type DictationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dictations to delete
     */
    where?: DictationWhereInput
    /**
     * Limit how many Dictations to delete.
     */
    limit?: number
  }

  /**
   * Dictation.user
   */
  export type Dictation$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Dictation without action
   */
  export type DictationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dictation
     */
    select?: DictationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Dictation
     */
    omit?: DictationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DictationInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserLlmSettingsScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    ollamaBaseUrl: 'ollamaBaseUrl',
    ollamaModel: 'ollamaModel',
    ollamaTranslationModel: 'ollamaTranslationModel',
    ollamaPrompt: 'ollamaPrompt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserLlmSettingsScalarFieldEnum = (typeof UserLlmSettingsScalarFieldEnum)[keyof typeof UserLlmSettingsScalarFieldEnum]


  export const DictionaryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    word: 'word',
    category: 'category',
    frequency: 'frequency',
    addedAt: 'addedAt'
  };

  export type DictionaryScalarFieldEnum = (typeof DictionaryScalarFieldEnum)[keyof typeof DictionaryScalarFieldEnum]


  export const SnippetScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    trigger: 'trigger',
    replacement: 'replacement',
    category: 'category',
    createdAt: 'createdAt'
  };

  export type SnippetScalarFieldEnum = (typeof SnippetScalarFieldEnum)[keyof typeof SnippetScalarFieldEnum]


  export const DictationScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    text: 'text',
    language: 'language',
    charCount: 'charCount',
    createdAt: 'createdAt'
  };

  export type DictationScalarFieldEnum = (typeof DictationScalarFieldEnum)[keyof typeof DictationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    dictations?: DictationListRelationFilter
    dictionaries?: DictionaryListRelationFilter
    snippets?: SnippetListRelationFilter
    llmSettings?: XOR<UserLlmSettingsNullableScalarRelationFilter, UserLlmSettingsWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    dictations?: DictationOrderByRelationAggregateInput
    dictionaries?: DictionaryOrderByRelationAggregateInput
    snippets?: SnippetOrderByRelationAggregateInput
    llmSettings?: UserLlmSettingsOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    dictations?: DictationListRelationFilter
    dictionaries?: DictionaryListRelationFilter
    snippets?: SnippetListRelationFilter
    llmSettings?: XOR<UserLlmSettingsNullableScalarRelationFilter, UserLlmSettingsWhereInput> | null
  }, "id" | "email" | "username">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type UserLlmSettingsWhereInput = {
    AND?: UserLlmSettingsWhereInput | UserLlmSettingsWhereInput[]
    OR?: UserLlmSettingsWhereInput[]
    NOT?: UserLlmSettingsWhereInput | UserLlmSettingsWhereInput[]
    id?: StringFilter<"UserLlmSettings"> | string
    userId?: StringFilter<"UserLlmSettings"> | string
    ollamaBaseUrl?: StringFilter<"UserLlmSettings"> | string
    ollamaModel?: StringFilter<"UserLlmSettings"> | string
    ollamaTranslationModel?: StringFilter<"UserLlmSettings"> | string
    ollamaPrompt?: StringFilter<"UserLlmSettings"> | string
    createdAt?: DateTimeFilter<"UserLlmSettings"> | Date | string
    updatedAt?: DateTimeFilter<"UserLlmSettings"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserLlmSettingsOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    ollamaBaseUrl?: SortOrder
    ollamaModel?: SortOrder
    ollamaTranslationModel?: SortOrder
    ollamaPrompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserLlmSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserLlmSettingsWhereInput | UserLlmSettingsWhereInput[]
    OR?: UserLlmSettingsWhereInput[]
    NOT?: UserLlmSettingsWhereInput | UserLlmSettingsWhereInput[]
    ollamaBaseUrl?: StringFilter<"UserLlmSettings"> | string
    ollamaModel?: StringFilter<"UserLlmSettings"> | string
    ollamaTranslationModel?: StringFilter<"UserLlmSettings"> | string
    ollamaPrompt?: StringFilter<"UserLlmSettings"> | string
    createdAt?: DateTimeFilter<"UserLlmSettings"> | Date | string
    updatedAt?: DateTimeFilter<"UserLlmSettings"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserLlmSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    ollamaBaseUrl?: SortOrder
    ollamaModel?: SortOrder
    ollamaTranslationModel?: SortOrder
    ollamaPrompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserLlmSettingsCountOrderByAggregateInput
    _max?: UserLlmSettingsMaxOrderByAggregateInput
    _min?: UserLlmSettingsMinOrderByAggregateInput
  }

  export type UserLlmSettingsScalarWhereWithAggregatesInput = {
    AND?: UserLlmSettingsScalarWhereWithAggregatesInput | UserLlmSettingsScalarWhereWithAggregatesInput[]
    OR?: UserLlmSettingsScalarWhereWithAggregatesInput[]
    NOT?: UserLlmSettingsScalarWhereWithAggregatesInput | UserLlmSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserLlmSettings"> | string
    userId?: StringWithAggregatesFilter<"UserLlmSettings"> | string
    ollamaBaseUrl?: StringWithAggregatesFilter<"UserLlmSettings"> | string
    ollamaModel?: StringWithAggregatesFilter<"UserLlmSettings"> | string
    ollamaTranslationModel?: StringWithAggregatesFilter<"UserLlmSettings"> | string
    ollamaPrompt?: StringWithAggregatesFilter<"UserLlmSettings"> | string
    createdAt?: DateTimeWithAggregatesFilter<"UserLlmSettings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserLlmSettings"> | Date | string
  }

  export type DictionaryWhereInput = {
    AND?: DictionaryWhereInput | DictionaryWhereInput[]
    OR?: DictionaryWhereInput[]
    NOT?: DictionaryWhereInput | DictionaryWhereInput[]
    id?: IntFilter<"Dictionary"> | number
    userId?: StringFilter<"Dictionary"> | string
    word?: StringFilter<"Dictionary"> | string
    category?: StringFilter<"Dictionary"> | string
    frequency?: IntFilter<"Dictionary"> | number
    addedAt?: DateTimeFilter<"Dictionary"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type DictionaryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    word?: SortOrder
    category?: SortOrder
    frequency?: SortOrder
    addedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type DictionaryWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId_word?: DictionaryUserIdWordCompoundUniqueInput
    AND?: DictionaryWhereInput | DictionaryWhereInput[]
    OR?: DictionaryWhereInput[]
    NOT?: DictionaryWhereInput | DictionaryWhereInput[]
    userId?: StringFilter<"Dictionary"> | string
    word?: StringFilter<"Dictionary"> | string
    category?: StringFilter<"Dictionary"> | string
    frequency?: IntFilter<"Dictionary"> | number
    addedAt?: DateTimeFilter<"Dictionary"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_word">

  export type DictionaryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    word?: SortOrder
    category?: SortOrder
    frequency?: SortOrder
    addedAt?: SortOrder
    _count?: DictionaryCountOrderByAggregateInput
    _avg?: DictionaryAvgOrderByAggregateInput
    _max?: DictionaryMaxOrderByAggregateInput
    _min?: DictionaryMinOrderByAggregateInput
    _sum?: DictionarySumOrderByAggregateInput
  }

  export type DictionaryScalarWhereWithAggregatesInput = {
    AND?: DictionaryScalarWhereWithAggregatesInput | DictionaryScalarWhereWithAggregatesInput[]
    OR?: DictionaryScalarWhereWithAggregatesInput[]
    NOT?: DictionaryScalarWhereWithAggregatesInput | DictionaryScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Dictionary"> | number
    userId?: StringWithAggregatesFilter<"Dictionary"> | string
    word?: StringWithAggregatesFilter<"Dictionary"> | string
    category?: StringWithAggregatesFilter<"Dictionary"> | string
    frequency?: IntWithAggregatesFilter<"Dictionary"> | number
    addedAt?: DateTimeWithAggregatesFilter<"Dictionary"> | Date | string
  }

  export type SnippetWhereInput = {
    AND?: SnippetWhereInput | SnippetWhereInput[]
    OR?: SnippetWhereInput[]
    NOT?: SnippetWhereInput | SnippetWhereInput[]
    id?: StringFilter<"Snippet"> | string
    userId?: StringFilter<"Snippet"> | string
    trigger?: StringFilter<"Snippet"> | string
    replacement?: StringFilter<"Snippet"> | string
    category?: StringFilter<"Snippet"> | string
    createdAt?: DateTimeFilter<"Snippet"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SnippetOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    trigger?: SortOrder
    replacement?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SnippetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_trigger?: SnippetUserIdTriggerCompoundUniqueInput
    AND?: SnippetWhereInput | SnippetWhereInput[]
    OR?: SnippetWhereInput[]
    NOT?: SnippetWhereInput | SnippetWhereInput[]
    userId?: StringFilter<"Snippet"> | string
    trigger?: StringFilter<"Snippet"> | string
    replacement?: StringFilter<"Snippet"> | string
    category?: StringFilter<"Snippet"> | string
    createdAt?: DateTimeFilter<"Snippet"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId_trigger">

  export type SnippetOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    trigger?: SortOrder
    replacement?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
    _count?: SnippetCountOrderByAggregateInput
    _max?: SnippetMaxOrderByAggregateInput
    _min?: SnippetMinOrderByAggregateInput
  }

  export type SnippetScalarWhereWithAggregatesInput = {
    AND?: SnippetScalarWhereWithAggregatesInput | SnippetScalarWhereWithAggregatesInput[]
    OR?: SnippetScalarWhereWithAggregatesInput[]
    NOT?: SnippetScalarWhereWithAggregatesInput | SnippetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Snippet"> | string
    userId?: StringWithAggregatesFilter<"Snippet"> | string
    trigger?: StringWithAggregatesFilter<"Snippet"> | string
    replacement?: StringWithAggregatesFilter<"Snippet"> | string
    category?: StringWithAggregatesFilter<"Snippet"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Snippet"> | Date | string
  }

  export type DictationWhereInput = {
    AND?: DictationWhereInput | DictationWhereInput[]
    OR?: DictationWhereInput[]
    NOT?: DictationWhereInput | DictationWhereInput[]
    id?: StringFilter<"Dictation"> | string
    userId?: StringNullableFilter<"Dictation"> | string | null
    text?: StringFilter<"Dictation"> | string
    language?: StringFilter<"Dictation"> | string
    charCount?: IntFilter<"Dictation"> | number
    createdAt?: DateTimeFilter<"Dictation"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type DictationOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    text?: SortOrder
    language?: SortOrder
    charCount?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type DictationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DictationWhereInput | DictationWhereInput[]
    OR?: DictationWhereInput[]
    NOT?: DictationWhereInput | DictationWhereInput[]
    userId?: StringNullableFilter<"Dictation"> | string | null
    text?: StringFilter<"Dictation"> | string
    language?: StringFilter<"Dictation"> | string
    charCount?: IntFilter<"Dictation"> | number
    createdAt?: DateTimeFilter<"Dictation"> | Date | string
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type DictationOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    text?: SortOrder
    language?: SortOrder
    charCount?: SortOrder
    createdAt?: SortOrder
    _count?: DictationCountOrderByAggregateInput
    _avg?: DictationAvgOrderByAggregateInput
    _max?: DictationMaxOrderByAggregateInput
    _min?: DictationMinOrderByAggregateInput
    _sum?: DictationSumOrderByAggregateInput
  }

  export type DictationScalarWhereWithAggregatesInput = {
    AND?: DictationScalarWhereWithAggregatesInput | DictationScalarWhereWithAggregatesInput[]
    OR?: DictationScalarWhereWithAggregatesInput[]
    NOT?: DictationScalarWhereWithAggregatesInput | DictationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Dictation"> | string
    userId?: StringNullableWithAggregatesFilter<"Dictation"> | string | null
    text?: StringWithAggregatesFilter<"Dictation"> | string
    language?: StringWithAggregatesFilter<"Dictation"> | string
    charCount?: IntWithAggregatesFilter<"Dictation"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Dictation"> | Date | string
  }

  export type UserCreateInput = {
    id: string
    email: string
    username: string
    passwordHash: string
    createdAt?: Date | string
    dictations?: DictationCreateNestedManyWithoutUserInput
    dictionaries?: DictionaryCreateNestedManyWithoutUserInput
    snippets?: SnippetCreateNestedManyWithoutUserInput
    llmSettings?: UserLlmSettingsCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    email: string
    username: string
    passwordHash: string
    createdAt?: Date | string
    dictations?: DictationUncheckedCreateNestedManyWithoutUserInput
    dictionaries?: DictionaryUncheckedCreateNestedManyWithoutUserInput
    snippets?: SnippetUncheckedCreateNestedManyWithoutUserInput
    llmSettings?: UserLlmSettingsUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dictations?: DictationUpdateManyWithoutUserNestedInput
    dictionaries?: DictionaryUpdateManyWithoutUserNestedInput
    snippets?: SnippetUpdateManyWithoutUserNestedInput
    llmSettings?: UserLlmSettingsUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dictations?: DictationUncheckedUpdateManyWithoutUserNestedInput
    dictionaries?: DictionaryUncheckedUpdateManyWithoutUserNestedInput
    snippets?: SnippetUncheckedUpdateManyWithoutUserNestedInput
    llmSettings?: UserLlmSettingsUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    email: string
    username: string
    passwordHash: string
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLlmSettingsCreateInput = {
    id: string
    ollamaBaseUrl: string
    ollamaModel: string
    ollamaTranslationModel?: string
    ollamaPrompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLlmSettingsInput
  }

  export type UserLlmSettingsUncheckedCreateInput = {
    id: string
    userId: string
    ollamaBaseUrl: string
    ollamaModel: string
    ollamaTranslationModel?: string
    ollamaPrompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserLlmSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    ollamaBaseUrl?: StringFieldUpdateOperationsInput | string
    ollamaModel?: StringFieldUpdateOperationsInput | string
    ollamaTranslationModel?: StringFieldUpdateOperationsInput | string
    ollamaPrompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLlmSettingsNestedInput
  }

  export type UserLlmSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    ollamaBaseUrl?: StringFieldUpdateOperationsInput | string
    ollamaModel?: StringFieldUpdateOperationsInput | string
    ollamaTranslationModel?: StringFieldUpdateOperationsInput | string
    ollamaPrompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLlmSettingsCreateManyInput = {
    id: string
    userId: string
    ollamaBaseUrl: string
    ollamaModel: string
    ollamaTranslationModel?: string
    ollamaPrompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserLlmSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    ollamaBaseUrl?: StringFieldUpdateOperationsInput | string
    ollamaModel?: StringFieldUpdateOperationsInput | string
    ollamaTranslationModel?: StringFieldUpdateOperationsInput | string
    ollamaPrompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLlmSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    ollamaBaseUrl?: StringFieldUpdateOperationsInput | string
    ollamaModel?: StringFieldUpdateOperationsInput | string
    ollamaTranslationModel?: StringFieldUpdateOperationsInput | string
    ollamaPrompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DictionaryCreateInput = {
    word: string
    category: string
    frequency?: number
    addedAt?: Date | string
    user: UserCreateNestedOneWithoutDictionariesInput
  }

  export type DictionaryUncheckedCreateInput = {
    id?: number
    userId: string
    word: string
    category: string
    frequency?: number
    addedAt?: Date | string
  }

  export type DictionaryUpdateInput = {
    word?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDictionariesNestedInput
  }

  export type DictionaryUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    word?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DictionaryCreateManyInput = {
    id?: number
    userId: string
    word: string
    category: string
    frequency?: number
    addedAt?: Date | string
  }

  export type DictionaryUpdateManyMutationInput = {
    word?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DictionaryUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    word?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnippetCreateInput = {
    id: string
    trigger: string
    replacement: string
    category: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutSnippetsInput
  }

  export type SnippetUncheckedCreateInput = {
    id: string
    userId: string
    trigger: string
    replacement: string
    category: string
    createdAt?: Date | string
  }

  export type SnippetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    trigger?: StringFieldUpdateOperationsInput | string
    replacement?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSnippetsNestedInput
  }

  export type SnippetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    trigger?: StringFieldUpdateOperationsInput | string
    replacement?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnippetCreateManyInput = {
    id: string
    userId: string
    trigger: string
    replacement: string
    category: string
    createdAt?: Date | string
  }

  export type SnippetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    trigger?: StringFieldUpdateOperationsInput | string
    replacement?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnippetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    trigger?: StringFieldUpdateOperationsInput | string
    replacement?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DictationCreateInput = {
    id: string
    text: string
    language: string
    charCount: number
    createdAt?: Date | string
    user?: UserCreateNestedOneWithoutDictationsInput
  }

  export type DictationUncheckedCreateInput = {
    id: string
    userId?: string | null
    text: string
    language: string
    charCount: number
    createdAt?: Date | string
  }

  export type DictationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    charCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneWithoutDictationsNestedInput
  }

  export type DictationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    text?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    charCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DictationCreateManyInput = {
    id: string
    userId?: string | null
    text: string
    language: string
    charCount: number
    createdAt?: Date | string
  }

  export type DictationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    charCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DictationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    text?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    charCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DictationListRelationFilter = {
    every?: DictationWhereInput
    some?: DictationWhereInput
    none?: DictationWhereInput
  }

  export type DictionaryListRelationFilter = {
    every?: DictionaryWhereInput
    some?: DictionaryWhereInput
    none?: DictionaryWhereInput
  }

  export type SnippetListRelationFilter = {
    every?: SnippetWhereInput
    some?: SnippetWhereInput
    none?: SnippetWhereInput
  }

  export type UserLlmSettingsNullableScalarRelationFilter = {
    is?: UserLlmSettingsWhereInput | null
    isNot?: UserLlmSettingsWhereInput | null
  }

  export type DictationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DictionaryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SnippetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type UserLlmSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ollamaBaseUrl?: SortOrder
    ollamaModel?: SortOrder
    ollamaTranslationModel?: SortOrder
    ollamaPrompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserLlmSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ollamaBaseUrl?: SortOrder
    ollamaModel?: SortOrder
    ollamaTranslationModel?: SortOrder
    ollamaPrompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserLlmSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ollamaBaseUrl?: SortOrder
    ollamaModel?: SortOrder
    ollamaTranslationModel?: SortOrder
    ollamaPrompt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DictionaryUserIdWordCompoundUniqueInput = {
    userId: string
    word: string
  }

  export type DictionaryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    word?: SortOrder
    category?: SortOrder
    frequency?: SortOrder
    addedAt?: SortOrder
  }

  export type DictionaryAvgOrderByAggregateInput = {
    id?: SortOrder
    frequency?: SortOrder
  }

  export type DictionaryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    word?: SortOrder
    category?: SortOrder
    frequency?: SortOrder
    addedAt?: SortOrder
  }

  export type DictionaryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    word?: SortOrder
    category?: SortOrder
    frequency?: SortOrder
    addedAt?: SortOrder
  }

  export type DictionarySumOrderByAggregateInput = {
    id?: SortOrder
    frequency?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type SnippetUserIdTriggerCompoundUniqueInput = {
    userId: string
    trigger: string
  }

  export type SnippetCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    trigger?: SortOrder
    replacement?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
  }

  export type SnippetMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    trigger?: SortOrder
    replacement?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
  }

  export type SnippetMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    trigger?: SortOrder
    replacement?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DictationCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    text?: SortOrder
    language?: SortOrder
    charCount?: SortOrder
    createdAt?: SortOrder
  }

  export type DictationAvgOrderByAggregateInput = {
    charCount?: SortOrder
  }

  export type DictationMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    text?: SortOrder
    language?: SortOrder
    charCount?: SortOrder
    createdAt?: SortOrder
  }

  export type DictationMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    text?: SortOrder
    language?: SortOrder
    charCount?: SortOrder
    createdAt?: SortOrder
  }

  export type DictationSumOrderByAggregateInput = {
    charCount?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DictationCreateNestedManyWithoutUserInput = {
    create?: XOR<DictationCreateWithoutUserInput, DictationUncheckedCreateWithoutUserInput> | DictationCreateWithoutUserInput[] | DictationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DictationCreateOrConnectWithoutUserInput | DictationCreateOrConnectWithoutUserInput[]
    createMany?: DictationCreateManyUserInputEnvelope
    connect?: DictationWhereUniqueInput | DictationWhereUniqueInput[]
  }

  export type DictionaryCreateNestedManyWithoutUserInput = {
    create?: XOR<DictionaryCreateWithoutUserInput, DictionaryUncheckedCreateWithoutUserInput> | DictionaryCreateWithoutUserInput[] | DictionaryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DictionaryCreateOrConnectWithoutUserInput | DictionaryCreateOrConnectWithoutUserInput[]
    createMany?: DictionaryCreateManyUserInputEnvelope
    connect?: DictionaryWhereUniqueInput | DictionaryWhereUniqueInput[]
  }

  export type SnippetCreateNestedManyWithoutUserInput = {
    create?: XOR<SnippetCreateWithoutUserInput, SnippetUncheckedCreateWithoutUserInput> | SnippetCreateWithoutUserInput[] | SnippetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SnippetCreateOrConnectWithoutUserInput | SnippetCreateOrConnectWithoutUserInput[]
    createMany?: SnippetCreateManyUserInputEnvelope
    connect?: SnippetWhereUniqueInput | SnippetWhereUniqueInput[]
  }

  export type UserLlmSettingsCreateNestedOneWithoutUserInput = {
    create?: XOR<UserLlmSettingsCreateWithoutUserInput, UserLlmSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserLlmSettingsCreateOrConnectWithoutUserInput
    connect?: UserLlmSettingsWhereUniqueInput
  }

  export type DictationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DictationCreateWithoutUserInput, DictationUncheckedCreateWithoutUserInput> | DictationCreateWithoutUserInput[] | DictationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DictationCreateOrConnectWithoutUserInput | DictationCreateOrConnectWithoutUserInput[]
    createMany?: DictationCreateManyUserInputEnvelope
    connect?: DictationWhereUniqueInput | DictationWhereUniqueInput[]
  }

  export type DictionaryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DictionaryCreateWithoutUserInput, DictionaryUncheckedCreateWithoutUserInput> | DictionaryCreateWithoutUserInput[] | DictionaryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DictionaryCreateOrConnectWithoutUserInput | DictionaryCreateOrConnectWithoutUserInput[]
    createMany?: DictionaryCreateManyUserInputEnvelope
    connect?: DictionaryWhereUniqueInput | DictionaryWhereUniqueInput[]
  }

  export type SnippetUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SnippetCreateWithoutUserInput, SnippetUncheckedCreateWithoutUserInput> | SnippetCreateWithoutUserInput[] | SnippetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SnippetCreateOrConnectWithoutUserInput | SnippetCreateOrConnectWithoutUserInput[]
    createMany?: SnippetCreateManyUserInputEnvelope
    connect?: SnippetWhereUniqueInput | SnippetWhereUniqueInput[]
  }

  export type UserLlmSettingsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserLlmSettingsCreateWithoutUserInput, UserLlmSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserLlmSettingsCreateOrConnectWithoutUserInput
    connect?: UserLlmSettingsWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DictationUpdateManyWithoutUserNestedInput = {
    create?: XOR<DictationCreateWithoutUserInput, DictationUncheckedCreateWithoutUserInput> | DictationCreateWithoutUserInput[] | DictationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DictationCreateOrConnectWithoutUserInput | DictationCreateOrConnectWithoutUserInput[]
    upsert?: DictationUpsertWithWhereUniqueWithoutUserInput | DictationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DictationCreateManyUserInputEnvelope
    set?: DictationWhereUniqueInput | DictationWhereUniqueInput[]
    disconnect?: DictationWhereUniqueInput | DictationWhereUniqueInput[]
    delete?: DictationWhereUniqueInput | DictationWhereUniqueInput[]
    connect?: DictationWhereUniqueInput | DictationWhereUniqueInput[]
    update?: DictationUpdateWithWhereUniqueWithoutUserInput | DictationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DictationUpdateManyWithWhereWithoutUserInput | DictationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DictationScalarWhereInput | DictationScalarWhereInput[]
  }

  export type DictionaryUpdateManyWithoutUserNestedInput = {
    create?: XOR<DictionaryCreateWithoutUserInput, DictionaryUncheckedCreateWithoutUserInput> | DictionaryCreateWithoutUserInput[] | DictionaryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DictionaryCreateOrConnectWithoutUserInput | DictionaryCreateOrConnectWithoutUserInput[]
    upsert?: DictionaryUpsertWithWhereUniqueWithoutUserInput | DictionaryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DictionaryCreateManyUserInputEnvelope
    set?: DictionaryWhereUniqueInput | DictionaryWhereUniqueInput[]
    disconnect?: DictionaryWhereUniqueInput | DictionaryWhereUniqueInput[]
    delete?: DictionaryWhereUniqueInput | DictionaryWhereUniqueInput[]
    connect?: DictionaryWhereUniqueInput | DictionaryWhereUniqueInput[]
    update?: DictionaryUpdateWithWhereUniqueWithoutUserInput | DictionaryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DictionaryUpdateManyWithWhereWithoutUserInput | DictionaryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DictionaryScalarWhereInput | DictionaryScalarWhereInput[]
  }

  export type SnippetUpdateManyWithoutUserNestedInput = {
    create?: XOR<SnippetCreateWithoutUserInput, SnippetUncheckedCreateWithoutUserInput> | SnippetCreateWithoutUserInput[] | SnippetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SnippetCreateOrConnectWithoutUserInput | SnippetCreateOrConnectWithoutUserInput[]
    upsert?: SnippetUpsertWithWhereUniqueWithoutUserInput | SnippetUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SnippetCreateManyUserInputEnvelope
    set?: SnippetWhereUniqueInput | SnippetWhereUniqueInput[]
    disconnect?: SnippetWhereUniqueInput | SnippetWhereUniqueInput[]
    delete?: SnippetWhereUniqueInput | SnippetWhereUniqueInput[]
    connect?: SnippetWhereUniqueInput | SnippetWhereUniqueInput[]
    update?: SnippetUpdateWithWhereUniqueWithoutUserInput | SnippetUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SnippetUpdateManyWithWhereWithoutUserInput | SnippetUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SnippetScalarWhereInput | SnippetScalarWhereInput[]
  }

  export type UserLlmSettingsUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserLlmSettingsCreateWithoutUserInput, UserLlmSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserLlmSettingsCreateOrConnectWithoutUserInput
    upsert?: UserLlmSettingsUpsertWithoutUserInput
    disconnect?: UserLlmSettingsWhereInput | boolean
    delete?: UserLlmSettingsWhereInput | boolean
    connect?: UserLlmSettingsWhereUniqueInput
    update?: XOR<XOR<UserLlmSettingsUpdateToOneWithWhereWithoutUserInput, UserLlmSettingsUpdateWithoutUserInput>, UserLlmSettingsUncheckedUpdateWithoutUserInput>
  }

  export type DictationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DictationCreateWithoutUserInput, DictationUncheckedCreateWithoutUserInput> | DictationCreateWithoutUserInput[] | DictationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DictationCreateOrConnectWithoutUserInput | DictationCreateOrConnectWithoutUserInput[]
    upsert?: DictationUpsertWithWhereUniqueWithoutUserInput | DictationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DictationCreateManyUserInputEnvelope
    set?: DictationWhereUniqueInput | DictationWhereUniqueInput[]
    disconnect?: DictationWhereUniqueInput | DictationWhereUniqueInput[]
    delete?: DictationWhereUniqueInput | DictationWhereUniqueInput[]
    connect?: DictationWhereUniqueInput | DictationWhereUniqueInput[]
    update?: DictationUpdateWithWhereUniqueWithoutUserInput | DictationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DictationUpdateManyWithWhereWithoutUserInput | DictationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DictationScalarWhereInput | DictationScalarWhereInput[]
  }

  export type DictionaryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DictionaryCreateWithoutUserInput, DictionaryUncheckedCreateWithoutUserInput> | DictionaryCreateWithoutUserInput[] | DictionaryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DictionaryCreateOrConnectWithoutUserInput | DictionaryCreateOrConnectWithoutUserInput[]
    upsert?: DictionaryUpsertWithWhereUniqueWithoutUserInput | DictionaryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DictionaryCreateManyUserInputEnvelope
    set?: DictionaryWhereUniqueInput | DictionaryWhereUniqueInput[]
    disconnect?: DictionaryWhereUniqueInput | DictionaryWhereUniqueInput[]
    delete?: DictionaryWhereUniqueInput | DictionaryWhereUniqueInput[]
    connect?: DictionaryWhereUniqueInput | DictionaryWhereUniqueInput[]
    update?: DictionaryUpdateWithWhereUniqueWithoutUserInput | DictionaryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DictionaryUpdateManyWithWhereWithoutUserInput | DictionaryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DictionaryScalarWhereInput | DictionaryScalarWhereInput[]
  }

  export type SnippetUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SnippetCreateWithoutUserInput, SnippetUncheckedCreateWithoutUserInput> | SnippetCreateWithoutUserInput[] | SnippetUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SnippetCreateOrConnectWithoutUserInput | SnippetCreateOrConnectWithoutUserInput[]
    upsert?: SnippetUpsertWithWhereUniqueWithoutUserInput | SnippetUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SnippetCreateManyUserInputEnvelope
    set?: SnippetWhereUniqueInput | SnippetWhereUniqueInput[]
    disconnect?: SnippetWhereUniqueInput | SnippetWhereUniqueInput[]
    delete?: SnippetWhereUniqueInput | SnippetWhereUniqueInput[]
    connect?: SnippetWhereUniqueInput | SnippetWhereUniqueInput[]
    update?: SnippetUpdateWithWhereUniqueWithoutUserInput | SnippetUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SnippetUpdateManyWithWhereWithoutUserInput | SnippetUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SnippetScalarWhereInput | SnippetScalarWhereInput[]
  }

  export type UserLlmSettingsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserLlmSettingsCreateWithoutUserInput, UserLlmSettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserLlmSettingsCreateOrConnectWithoutUserInput
    upsert?: UserLlmSettingsUpsertWithoutUserInput
    disconnect?: UserLlmSettingsWhereInput | boolean
    delete?: UserLlmSettingsWhereInput | boolean
    connect?: UserLlmSettingsWhereUniqueInput
    update?: XOR<XOR<UserLlmSettingsUpdateToOneWithWhereWithoutUserInput, UserLlmSettingsUpdateWithoutUserInput>, UserLlmSettingsUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutLlmSettingsInput = {
    create?: XOR<UserCreateWithoutLlmSettingsInput, UserUncheckedCreateWithoutLlmSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLlmSettingsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutLlmSettingsNestedInput = {
    create?: XOR<UserCreateWithoutLlmSettingsInput, UserUncheckedCreateWithoutLlmSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLlmSettingsInput
    upsert?: UserUpsertWithoutLlmSettingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLlmSettingsInput, UserUpdateWithoutLlmSettingsInput>, UserUncheckedUpdateWithoutLlmSettingsInput>
  }

  export type UserCreateNestedOneWithoutDictionariesInput = {
    create?: XOR<UserCreateWithoutDictionariesInput, UserUncheckedCreateWithoutDictionariesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDictionariesInput
    connect?: UserWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutDictionariesNestedInput = {
    create?: XOR<UserCreateWithoutDictionariesInput, UserUncheckedCreateWithoutDictionariesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDictionariesInput
    upsert?: UserUpsertWithoutDictionariesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDictionariesInput, UserUpdateWithoutDictionariesInput>, UserUncheckedUpdateWithoutDictionariesInput>
  }

  export type UserCreateNestedOneWithoutSnippetsInput = {
    create?: XOR<UserCreateWithoutSnippetsInput, UserUncheckedCreateWithoutSnippetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSnippetsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSnippetsNestedInput = {
    create?: XOR<UserCreateWithoutSnippetsInput, UserUncheckedCreateWithoutSnippetsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSnippetsInput
    upsert?: UserUpsertWithoutSnippetsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSnippetsInput, UserUpdateWithoutSnippetsInput>, UserUncheckedUpdateWithoutSnippetsInput>
  }

  export type UserCreateNestedOneWithoutDictationsInput = {
    create?: XOR<UserCreateWithoutDictationsInput, UserUncheckedCreateWithoutDictationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDictationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutDictationsNestedInput = {
    create?: XOR<UserCreateWithoutDictationsInput, UserUncheckedCreateWithoutDictationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDictationsInput
    upsert?: UserUpsertWithoutDictationsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDictationsInput, UserUpdateWithoutDictationsInput>, UserUncheckedUpdateWithoutDictationsInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type DictationCreateWithoutUserInput = {
    id: string
    text: string
    language: string
    charCount: number
    createdAt?: Date | string
  }

  export type DictationUncheckedCreateWithoutUserInput = {
    id: string
    text: string
    language: string
    charCount: number
    createdAt?: Date | string
  }

  export type DictationCreateOrConnectWithoutUserInput = {
    where: DictationWhereUniqueInput
    create: XOR<DictationCreateWithoutUserInput, DictationUncheckedCreateWithoutUserInput>
  }

  export type DictationCreateManyUserInputEnvelope = {
    data: DictationCreateManyUserInput | DictationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DictionaryCreateWithoutUserInput = {
    word: string
    category: string
    frequency?: number
    addedAt?: Date | string
  }

  export type DictionaryUncheckedCreateWithoutUserInput = {
    id?: number
    word: string
    category: string
    frequency?: number
    addedAt?: Date | string
  }

  export type DictionaryCreateOrConnectWithoutUserInput = {
    where: DictionaryWhereUniqueInput
    create: XOR<DictionaryCreateWithoutUserInput, DictionaryUncheckedCreateWithoutUserInput>
  }

  export type DictionaryCreateManyUserInputEnvelope = {
    data: DictionaryCreateManyUserInput | DictionaryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SnippetCreateWithoutUserInput = {
    id: string
    trigger: string
    replacement: string
    category: string
    createdAt?: Date | string
  }

  export type SnippetUncheckedCreateWithoutUserInput = {
    id: string
    trigger: string
    replacement: string
    category: string
    createdAt?: Date | string
  }

  export type SnippetCreateOrConnectWithoutUserInput = {
    where: SnippetWhereUniqueInput
    create: XOR<SnippetCreateWithoutUserInput, SnippetUncheckedCreateWithoutUserInput>
  }

  export type SnippetCreateManyUserInputEnvelope = {
    data: SnippetCreateManyUserInput | SnippetCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserLlmSettingsCreateWithoutUserInput = {
    id: string
    ollamaBaseUrl: string
    ollamaModel: string
    ollamaTranslationModel?: string
    ollamaPrompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserLlmSettingsUncheckedCreateWithoutUserInput = {
    id: string
    ollamaBaseUrl: string
    ollamaModel: string
    ollamaTranslationModel?: string
    ollamaPrompt: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserLlmSettingsCreateOrConnectWithoutUserInput = {
    where: UserLlmSettingsWhereUniqueInput
    create: XOR<UserLlmSettingsCreateWithoutUserInput, UserLlmSettingsUncheckedCreateWithoutUserInput>
  }

  export type DictationUpsertWithWhereUniqueWithoutUserInput = {
    where: DictationWhereUniqueInput
    update: XOR<DictationUpdateWithoutUserInput, DictationUncheckedUpdateWithoutUserInput>
    create: XOR<DictationCreateWithoutUserInput, DictationUncheckedCreateWithoutUserInput>
  }

  export type DictationUpdateWithWhereUniqueWithoutUserInput = {
    where: DictationWhereUniqueInput
    data: XOR<DictationUpdateWithoutUserInput, DictationUncheckedUpdateWithoutUserInput>
  }

  export type DictationUpdateManyWithWhereWithoutUserInput = {
    where: DictationScalarWhereInput
    data: XOR<DictationUpdateManyMutationInput, DictationUncheckedUpdateManyWithoutUserInput>
  }

  export type DictationScalarWhereInput = {
    AND?: DictationScalarWhereInput | DictationScalarWhereInput[]
    OR?: DictationScalarWhereInput[]
    NOT?: DictationScalarWhereInput | DictationScalarWhereInput[]
    id?: StringFilter<"Dictation"> | string
    userId?: StringNullableFilter<"Dictation"> | string | null
    text?: StringFilter<"Dictation"> | string
    language?: StringFilter<"Dictation"> | string
    charCount?: IntFilter<"Dictation"> | number
    createdAt?: DateTimeFilter<"Dictation"> | Date | string
  }

  export type DictionaryUpsertWithWhereUniqueWithoutUserInput = {
    where: DictionaryWhereUniqueInput
    update: XOR<DictionaryUpdateWithoutUserInput, DictionaryUncheckedUpdateWithoutUserInput>
    create: XOR<DictionaryCreateWithoutUserInput, DictionaryUncheckedCreateWithoutUserInput>
  }

  export type DictionaryUpdateWithWhereUniqueWithoutUserInput = {
    where: DictionaryWhereUniqueInput
    data: XOR<DictionaryUpdateWithoutUserInput, DictionaryUncheckedUpdateWithoutUserInput>
  }

  export type DictionaryUpdateManyWithWhereWithoutUserInput = {
    where: DictionaryScalarWhereInput
    data: XOR<DictionaryUpdateManyMutationInput, DictionaryUncheckedUpdateManyWithoutUserInput>
  }

  export type DictionaryScalarWhereInput = {
    AND?: DictionaryScalarWhereInput | DictionaryScalarWhereInput[]
    OR?: DictionaryScalarWhereInput[]
    NOT?: DictionaryScalarWhereInput | DictionaryScalarWhereInput[]
    id?: IntFilter<"Dictionary"> | number
    userId?: StringFilter<"Dictionary"> | string
    word?: StringFilter<"Dictionary"> | string
    category?: StringFilter<"Dictionary"> | string
    frequency?: IntFilter<"Dictionary"> | number
    addedAt?: DateTimeFilter<"Dictionary"> | Date | string
  }

  export type SnippetUpsertWithWhereUniqueWithoutUserInput = {
    where: SnippetWhereUniqueInput
    update: XOR<SnippetUpdateWithoutUserInput, SnippetUncheckedUpdateWithoutUserInput>
    create: XOR<SnippetCreateWithoutUserInput, SnippetUncheckedCreateWithoutUserInput>
  }

  export type SnippetUpdateWithWhereUniqueWithoutUserInput = {
    where: SnippetWhereUniqueInput
    data: XOR<SnippetUpdateWithoutUserInput, SnippetUncheckedUpdateWithoutUserInput>
  }

  export type SnippetUpdateManyWithWhereWithoutUserInput = {
    where: SnippetScalarWhereInput
    data: XOR<SnippetUpdateManyMutationInput, SnippetUncheckedUpdateManyWithoutUserInput>
  }

  export type SnippetScalarWhereInput = {
    AND?: SnippetScalarWhereInput | SnippetScalarWhereInput[]
    OR?: SnippetScalarWhereInput[]
    NOT?: SnippetScalarWhereInput | SnippetScalarWhereInput[]
    id?: StringFilter<"Snippet"> | string
    userId?: StringFilter<"Snippet"> | string
    trigger?: StringFilter<"Snippet"> | string
    replacement?: StringFilter<"Snippet"> | string
    category?: StringFilter<"Snippet"> | string
    createdAt?: DateTimeFilter<"Snippet"> | Date | string
  }

  export type UserLlmSettingsUpsertWithoutUserInput = {
    update: XOR<UserLlmSettingsUpdateWithoutUserInput, UserLlmSettingsUncheckedUpdateWithoutUserInput>
    create: XOR<UserLlmSettingsCreateWithoutUserInput, UserLlmSettingsUncheckedCreateWithoutUserInput>
    where?: UserLlmSettingsWhereInput
  }

  export type UserLlmSettingsUpdateToOneWithWhereWithoutUserInput = {
    where?: UserLlmSettingsWhereInput
    data: XOR<UserLlmSettingsUpdateWithoutUserInput, UserLlmSettingsUncheckedUpdateWithoutUserInput>
  }

  export type UserLlmSettingsUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ollamaBaseUrl?: StringFieldUpdateOperationsInput | string
    ollamaModel?: StringFieldUpdateOperationsInput | string
    ollamaTranslationModel?: StringFieldUpdateOperationsInput | string
    ollamaPrompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLlmSettingsUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    ollamaBaseUrl?: StringFieldUpdateOperationsInput | string
    ollamaModel?: StringFieldUpdateOperationsInput | string
    ollamaTranslationModel?: StringFieldUpdateOperationsInput | string
    ollamaPrompt?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutLlmSettingsInput = {
    id: string
    email: string
    username: string
    passwordHash: string
    createdAt?: Date | string
    dictations?: DictationCreateNestedManyWithoutUserInput
    dictionaries?: DictionaryCreateNestedManyWithoutUserInput
    snippets?: SnippetCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLlmSettingsInput = {
    id: string
    email: string
    username: string
    passwordHash: string
    createdAt?: Date | string
    dictations?: DictationUncheckedCreateNestedManyWithoutUserInput
    dictionaries?: DictionaryUncheckedCreateNestedManyWithoutUserInput
    snippets?: SnippetUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLlmSettingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLlmSettingsInput, UserUncheckedCreateWithoutLlmSettingsInput>
  }

  export type UserUpsertWithoutLlmSettingsInput = {
    update: XOR<UserUpdateWithoutLlmSettingsInput, UserUncheckedUpdateWithoutLlmSettingsInput>
    create: XOR<UserCreateWithoutLlmSettingsInput, UserUncheckedCreateWithoutLlmSettingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLlmSettingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLlmSettingsInput, UserUncheckedUpdateWithoutLlmSettingsInput>
  }

  export type UserUpdateWithoutLlmSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dictations?: DictationUpdateManyWithoutUserNestedInput
    dictionaries?: DictionaryUpdateManyWithoutUserNestedInput
    snippets?: SnippetUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLlmSettingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dictations?: DictationUncheckedUpdateManyWithoutUserNestedInput
    dictionaries?: DictionaryUncheckedUpdateManyWithoutUserNestedInput
    snippets?: SnippetUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutDictionariesInput = {
    id: string
    email: string
    username: string
    passwordHash: string
    createdAt?: Date | string
    dictations?: DictationCreateNestedManyWithoutUserInput
    snippets?: SnippetCreateNestedManyWithoutUserInput
    llmSettings?: UserLlmSettingsCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDictionariesInput = {
    id: string
    email: string
    username: string
    passwordHash: string
    createdAt?: Date | string
    dictations?: DictationUncheckedCreateNestedManyWithoutUserInput
    snippets?: SnippetUncheckedCreateNestedManyWithoutUserInput
    llmSettings?: UserLlmSettingsUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDictionariesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDictionariesInput, UserUncheckedCreateWithoutDictionariesInput>
  }

  export type UserUpsertWithoutDictionariesInput = {
    update: XOR<UserUpdateWithoutDictionariesInput, UserUncheckedUpdateWithoutDictionariesInput>
    create: XOR<UserCreateWithoutDictionariesInput, UserUncheckedCreateWithoutDictionariesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDictionariesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDictionariesInput, UserUncheckedUpdateWithoutDictionariesInput>
  }

  export type UserUpdateWithoutDictionariesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dictations?: DictationUpdateManyWithoutUserNestedInput
    snippets?: SnippetUpdateManyWithoutUserNestedInput
    llmSettings?: UserLlmSettingsUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDictionariesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dictations?: DictationUncheckedUpdateManyWithoutUserNestedInput
    snippets?: SnippetUncheckedUpdateManyWithoutUserNestedInput
    llmSettings?: UserLlmSettingsUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutSnippetsInput = {
    id: string
    email: string
    username: string
    passwordHash: string
    createdAt?: Date | string
    dictations?: DictationCreateNestedManyWithoutUserInput
    dictionaries?: DictionaryCreateNestedManyWithoutUserInput
    llmSettings?: UserLlmSettingsCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSnippetsInput = {
    id: string
    email: string
    username: string
    passwordHash: string
    createdAt?: Date | string
    dictations?: DictationUncheckedCreateNestedManyWithoutUserInput
    dictionaries?: DictionaryUncheckedCreateNestedManyWithoutUserInput
    llmSettings?: UserLlmSettingsUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSnippetsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSnippetsInput, UserUncheckedCreateWithoutSnippetsInput>
  }

  export type UserUpsertWithoutSnippetsInput = {
    update: XOR<UserUpdateWithoutSnippetsInput, UserUncheckedUpdateWithoutSnippetsInput>
    create: XOR<UserCreateWithoutSnippetsInput, UserUncheckedCreateWithoutSnippetsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSnippetsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSnippetsInput, UserUncheckedUpdateWithoutSnippetsInput>
  }

  export type UserUpdateWithoutSnippetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dictations?: DictationUpdateManyWithoutUserNestedInput
    dictionaries?: DictionaryUpdateManyWithoutUserNestedInput
    llmSettings?: UserLlmSettingsUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSnippetsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dictations?: DictationUncheckedUpdateManyWithoutUserNestedInput
    dictionaries?: DictionaryUncheckedUpdateManyWithoutUserNestedInput
    llmSettings?: UserLlmSettingsUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutDictationsInput = {
    id: string
    email: string
    username: string
    passwordHash: string
    createdAt?: Date | string
    dictionaries?: DictionaryCreateNestedManyWithoutUserInput
    snippets?: SnippetCreateNestedManyWithoutUserInput
    llmSettings?: UserLlmSettingsCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDictationsInput = {
    id: string
    email: string
    username: string
    passwordHash: string
    createdAt?: Date | string
    dictionaries?: DictionaryUncheckedCreateNestedManyWithoutUserInput
    snippets?: SnippetUncheckedCreateNestedManyWithoutUserInput
    llmSettings?: UserLlmSettingsUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDictationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDictationsInput, UserUncheckedCreateWithoutDictationsInput>
  }

  export type UserUpsertWithoutDictationsInput = {
    update: XOR<UserUpdateWithoutDictationsInput, UserUncheckedUpdateWithoutDictationsInput>
    create: XOR<UserCreateWithoutDictationsInput, UserUncheckedCreateWithoutDictationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDictationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDictationsInput, UserUncheckedUpdateWithoutDictationsInput>
  }

  export type UserUpdateWithoutDictationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dictionaries?: DictionaryUpdateManyWithoutUserNestedInput
    snippets?: SnippetUpdateManyWithoutUserNestedInput
    llmSettings?: UserLlmSettingsUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDictationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dictionaries?: DictionaryUncheckedUpdateManyWithoutUserNestedInput
    snippets?: SnippetUncheckedUpdateManyWithoutUserNestedInput
    llmSettings?: UserLlmSettingsUncheckedUpdateOneWithoutUserNestedInput
  }

  export type DictationCreateManyUserInput = {
    id: string
    text: string
    language: string
    charCount: number
    createdAt?: Date | string
  }

  export type DictionaryCreateManyUserInput = {
    id?: number
    word: string
    category: string
    frequency?: number
    addedAt?: Date | string
  }

  export type SnippetCreateManyUserInput = {
    id: string
    trigger: string
    replacement: string
    category: string
    createdAt?: Date | string
  }

  export type DictationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    charCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DictationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    charCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DictationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    charCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DictionaryUpdateWithoutUserInput = {
    word?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DictionaryUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    word?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DictionaryUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    word?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    frequency?: IntFieldUpdateOperationsInput | number
    addedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnippetUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    trigger?: StringFieldUpdateOperationsInput | string
    replacement?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnippetUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    trigger?: StringFieldUpdateOperationsInput | string
    replacement?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SnippetUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    trigger?: StringFieldUpdateOperationsInput | string
    replacement?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}