
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
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>
/**
 * Model Collaborator
 * 
 */
export type Collaborator = $Result.DefaultSelection<Prisma.$CollaboratorPayload>
/**
 * Model DocumentState
 * 
 */
export type DocumentState = $Result.DefaultSelection<Prisma.$DocumentStatePayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  OWNER: 'OWNER',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

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
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

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
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.collaborator`: Exposes CRUD operations for the **Collaborator** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Collaborators
    * const collaborators = await prisma.collaborator.findMany()
    * ```
    */
  get collaborator(): Prisma.CollaboratorDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.documentState`: Exposes CRUD operations for the **DocumentState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DocumentStates
    * const documentStates = await prisma.documentState.findMany()
    * ```
    */
  get documentState(): Prisma.DocumentStateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


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
    Document: 'Document',
    Collaborator: 'Collaborator',
    DocumentState: 'DocumentState',
    Message: 'Message'
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
      modelProps: "user" | "document" | "collaborator" | "documentState" | "message"
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
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
      Collaborator: {
        payload: Prisma.$CollaboratorPayload<ExtArgs>
        fields: Prisma.CollaboratorFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CollaboratorFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaboratorPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CollaboratorFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaboratorPayload>
          }
          findFirst: {
            args: Prisma.CollaboratorFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaboratorPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CollaboratorFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaboratorPayload>
          }
          findMany: {
            args: Prisma.CollaboratorFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaboratorPayload>[]
          }
          create: {
            args: Prisma.CollaboratorCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaboratorPayload>
          }
          createMany: {
            args: Prisma.CollaboratorCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CollaboratorCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaboratorPayload>[]
          }
          delete: {
            args: Prisma.CollaboratorDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaboratorPayload>
          }
          update: {
            args: Prisma.CollaboratorUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaboratorPayload>
          }
          deleteMany: {
            args: Prisma.CollaboratorDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CollaboratorUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CollaboratorUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaboratorPayload>[]
          }
          upsert: {
            args: Prisma.CollaboratorUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CollaboratorPayload>
          }
          aggregate: {
            args: Prisma.CollaboratorAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCollaborator>
          }
          groupBy: {
            args: Prisma.CollaboratorGroupByArgs<ExtArgs>
            result: $Utils.Optional<CollaboratorGroupByOutputType>[]
          }
          count: {
            args: Prisma.CollaboratorCountArgs<ExtArgs>
            result: $Utils.Optional<CollaboratorCountAggregateOutputType> | number
          }
        }
      }
      DocumentState: {
        payload: Prisma.$DocumentStatePayload<ExtArgs>
        fields: Prisma.DocumentStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentStatePayload>
          }
          findFirst: {
            args: Prisma.DocumentStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentStatePayload>
          }
          findMany: {
            args: Prisma.DocumentStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentStatePayload>[]
          }
          create: {
            args: Prisma.DocumentStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentStatePayload>
          }
          createMany: {
            args: Prisma.DocumentStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentStatePayload>[]
          }
          delete: {
            args: Prisma.DocumentStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentStatePayload>
          }
          update: {
            args: Prisma.DocumentStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentStatePayload>
          }
          deleteMany: {
            args: Prisma.DocumentStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentStateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentStatePayload>[]
          }
          upsert: {
            args: Prisma.DocumentStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentStatePayload>
          }
          aggregate: {
            args: Prisma.DocumentStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocumentState>
          }
          groupBy: {
            args: Prisma.DocumentStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentStateCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentStateCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
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
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
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
    document?: DocumentOmit
    collaborator?: CollaboratorOmit
    documentState?: DocumentStateOmit
    message?: MessageOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

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

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

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
    documents: number
    collaborations: number
    messages: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | UserCountOutputTypeCountDocumentsArgs
    collaborations?: boolean | UserCountOutputTypeCountCollaborationsArgs
    messages?: boolean | UserCountOutputTypeCountMessagesArgs
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
  export type UserCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCollaborationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollaboratorWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Count Type DocumentCountOutputType
   */

  export type DocumentCountOutputType = {
    collaborators: number
    messages: number
  }

  export type DocumentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    collaborators?: boolean | DocumentCountOutputTypeCountCollaboratorsArgs
    messages?: boolean | DocumentCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentCountOutputType
     */
    select?: DocumentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeCountCollaboratorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollaboratorWhereInput
  }

  /**
   * DocumentCountOutputType without action
   */
  export type DocumentCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    email: string | null
    name: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    email: string | null
    name: string | null
    password: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    password: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    createdAt?: true
    updatedAt?: true
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
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
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
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    email: string
    name: string | null
    password: string
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
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
    name?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    documents?: boolean | User$documentsArgs<ExtArgs>
    collaborations?: boolean | User$collaborationsArgs<ExtArgs>
    messages?: boolean | User$messagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "password" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | User$documentsArgs<ExtArgs>
    collaborations?: boolean | User$collaborationsArgs<ExtArgs>
    messages?: boolean | User$messagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      documents: Prisma.$DocumentPayload<ExtArgs>[]
      collaborations: Prisma.$CollaboratorPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      email: string
      name: string | null
      password: string
      createdAt: Date
      updatedAt: Date
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
    documents<T extends User$documentsArgs<ExtArgs> = {}>(args?: Subset<T, User$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    collaborations<T extends User$collaborationsArgs<ExtArgs> = {}>(args?: Subset<T, User$collaborationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends User$messagesArgs<ExtArgs> = {}>(args?: Subset<T, User$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly id: FieldRef<"User", 'Int'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
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
   * User.documents
   */
  export type User$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * User.collaborations
   */
  export type User$collaborationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorInclude<ExtArgs> | null
    where?: CollaboratorWhereInput
    orderBy?: CollaboratorOrderByWithRelationInput | CollaboratorOrderByWithRelationInput[]
    cursor?: CollaboratorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CollaboratorScalarFieldEnum | CollaboratorScalarFieldEnum[]
  }

  /**
   * User.messages
   */
  export type User$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
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
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentAvgAggregateOutputType = {
    id: number | null
    ownerId: number | null
  }

  export type DocumentSumAggregateOutputType = {
    id: number | null
    ownerId: number | null
  }

  export type DocumentMinAggregateOutputType = {
    id: number | null
    title: string | null
    ownerId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: number | null
    title: string | null
    ownerId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    title: number
    ownerId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentAvgAggregateInputType = {
    id?: true
    ownerId?: true
  }

  export type DocumentSumAggregateInputType = {
    id?: true
    ownerId?: true
  }

  export type DocumentMinAggregateInputType = {
    id?: true
    title?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    title?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    title?: true
    ownerId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _avg?: DocumentAvgAggregateInputType
    _sum?: DocumentSumAggregateInputType
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: number
    title: string
    ownerId: number
    createdAt: Date
    updatedAt: Date
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
    collaborators?: boolean | Document$collaboratorsArgs<ExtArgs>
    messages?: boolean | Document$messagesArgs<ExtArgs>
    state?: boolean | Document$stateArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    title?: boolean
    ownerId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "ownerId" | "createdAt" | "updatedAt", ExtArgs["result"]["document"]>
  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
    collaborators?: boolean | Document$collaboratorsArgs<ExtArgs>
    messages?: boolean | Document$messagesArgs<ExtArgs>
    state?: boolean | Document$stateArgs<ExtArgs>
    _count?: boolean | DocumentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    owner?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      owner: Prisma.$UserPayload<ExtArgs>
      collaborators: Prisma.$CollaboratorPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
      state: Prisma.$DocumentStatePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      ownerId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents and returns the data updated in the database.
     * @param {DocumentUpdateManyAndReturnArgs} args - Arguments to update many Documents.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.updateManyAndReturn({
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
    updateManyAndReturn<T extends DocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
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
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    owner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    collaborators<T extends Document$collaboratorsArgs<ExtArgs> = {}>(args?: Subset<T, Document$collaboratorsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends Document$messagesArgs<ExtArgs> = {}>(args?: Subset<T, Document$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    state<T extends Document$stateArgs<ExtArgs> = {}>(args?: Subset<T, Document$stateArgs<ExtArgs>>): Prisma__DocumentStateClient<$Result.GetResult<Prisma.$DocumentStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Document model
   */
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'Int'>
    readonly title: FieldRef<"Document", 'String'>
    readonly ownerId: FieldRef<"Document", 'Int'>
    readonly createdAt: FieldRef<"Document", 'DateTime'>
    readonly updatedAt: FieldRef<"Document", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document updateManyAndReturn
   */
  export type DocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to delete.
     */
    limit?: number
  }

  /**
   * Document.collaborators
   */
  export type Document$collaboratorsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorInclude<ExtArgs> | null
    where?: CollaboratorWhereInput
    orderBy?: CollaboratorOrderByWithRelationInput | CollaboratorOrderByWithRelationInput[]
    cursor?: CollaboratorWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CollaboratorScalarFieldEnum | CollaboratorScalarFieldEnum[]
  }

  /**
   * Document.messages
   */
  export type Document$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Document.state
   */
  export type Document$stateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateInclude<ExtArgs> | null
    where?: DocumentStateWhereInput
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
  }


  /**
   * Model Collaborator
   */

  export type AggregateCollaborator = {
    _count: CollaboratorCountAggregateOutputType | null
    _avg: CollaboratorAvgAggregateOutputType | null
    _sum: CollaboratorSumAggregateOutputType | null
    _min: CollaboratorMinAggregateOutputType | null
    _max: CollaboratorMaxAggregateOutputType | null
  }

  export type CollaboratorAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    documentId: number | null
  }

  export type CollaboratorSumAggregateOutputType = {
    id: number | null
    userId: number | null
    documentId: number | null
  }

  export type CollaboratorMinAggregateOutputType = {
    id: number | null
    userId: number | null
    documentId: number | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CollaboratorMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    documentId: number | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CollaboratorCountAggregateOutputType = {
    id: number
    userId: number
    documentId: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CollaboratorAvgAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
  }

  export type CollaboratorSumAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
  }

  export type CollaboratorMinAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CollaboratorMaxAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CollaboratorCountAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CollaboratorAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Collaborator to aggregate.
     */
    where?: CollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collaborators to fetch.
     */
    orderBy?: CollaboratorOrderByWithRelationInput | CollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collaborators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Collaborators
    **/
    _count?: true | CollaboratorCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CollaboratorAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CollaboratorSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CollaboratorMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CollaboratorMaxAggregateInputType
  }

  export type GetCollaboratorAggregateType<T extends CollaboratorAggregateArgs> = {
        [P in keyof T & keyof AggregateCollaborator]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCollaborator[P]>
      : GetScalarType<T[P], AggregateCollaborator[P]>
  }




  export type CollaboratorGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CollaboratorWhereInput
    orderBy?: CollaboratorOrderByWithAggregationInput | CollaboratorOrderByWithAggregationInput[]
    by: CollaboratorScalarFieldEnum[] | CollaboratorScalarFieldEnum
    having?: CollaboratorScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CollaboratorCountAggregateInputType | true
    _avg?: CollaboratorAvgAggregateInputType
    _sum?: CollaboratorSumAggregateInputType
    _min?: CollaboratorMinAggregateInputType
    _max?: CollaboratorMaxAggregateInputType
  }

  export type CollaboratorGroupByOutputType = {
    id: number
    userId: number
    documentId: number
    role: $Enums.Role
    createdAt: Date
    updatedAt: Date
    _count: CollaboratorCountAggregateOutputType | null
    _avg: CollaboratorAvgAggregateOutputType | null
    _sum: CollaboratorSumAggregateOutputType | null
    _min: CollaboratorMinAggregateOutputType | null
    _max: CollaboratorMaxAggregateOutputType | null
  }

  type GetCollaboratorGroupByPayload<T extends CollaboratorGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CollaboratorGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CollaboratorGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CollaboratorGroupByOutputType[P]>
            : GetScalarType<T[P], CollaboratorGroupByOutputType[P]>
        }
      >
    >


  export type CollaboratorSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    documentId?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collaborator"]>

  export type CollaboratorSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    documentId?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collaborator"]>

  export type CollaboratorSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    documentId?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["collaborator"]>

  export type CollaboratorSelectScalar = {
    id?: boolean
    userId?: boolean
    documentId?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CollaboratorOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "documentId" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["collaborator"]>
  export type CollaboratorInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type CollaboratorIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type CollaboratorIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }

  export type $CollaboratorPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Collaborator"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      document: Prisma.$DocumentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      documentId: number
      role: $Enums.Role
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["collaborator"]>
    composites: {}
  }

  type CollaboratorGetPayload<S extends boolean | null | undefined | CollaboratorDefaultArgs> = $Result.GetResult<Prisma.$CollaboratorPayload, S>

  type CollaboratorCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CollaboratorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CollaboratorCountAggregateInputType | true
    }

  export interface CollaboratorDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Collaborator'], meta: { name: 'Collaborator' } }
    /**
     * Find zero or one Collaborator that matches the filter.
     * @param {CollaboratorFindUniqueArgs} args - Arguments to find a Collaborator
     * @example
     * // Get one Collaborator
     * const collaborator = await prisma.collaborator.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CollaboratorFindUniqueArgs>(args: SelectSubset<T, CollaboratorFindUniqueArgs<ExtArgs>>): Prisma__CollaboratorClient<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Collaborator that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CollaboratorFindUniqueOrThrowArgs} args - Arguments to find a Collaborator
     * @example
     * // Get one Collaborator
     * const collaborator = await prisma.collaborator.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CollaboratorFindUniqueOrThrowArgs>(args: SelectSubset<T, CollaboratorFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CollaboratorClient<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Collaborator that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaboratorFindFirstArgs} args - Arguments to find a Collaborator
     * @example
     * // Get one Collaborator
     * const collaborator = await prisma.collaborator.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CollaboratorFindFirstArgs>(args?: SelectSubset<T, CollaboratorFindFirstArgs<ExtArgs>>): Prisma__CollaboratorClient<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Collaborator that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaboratorFindFirstOrThrowArgs} args - Arguments to find a Collaborator
     * @example
     * // Get one Collaborator
     * const collaborator = await prisma.collaborator.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CollaboratorFindFirstOrThrowArgs>(args?: SelectSubset<T, CollaboratorFindFirstOrThrowArgs<ExtArgs>>): Prisma__CollaboratorClient<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Collaborators that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaboratorFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Collaborators
     * const collaborators = await prisma.collaborator.findMany()
     * 
     * // Get first 10 Collaborators
     * const collaborators = await prisma.collaborator.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const collaboratorWithIdOnly = await prisma.collaborator.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CollaboratorFindManyArgs>(args?: SelectSubset<T, CollaboratorFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Collaborator.
     * @param {CollaboratorCreateArgs} args - Arguments to create a Collaborator.
     * @example
     * // Create one Collaborator
     * const Collaborator = await prisma.collaborator.create({
     *   data: {
     *     // ... data to create a Collaborator
     *   }
     * })
     * 
     */
    create<T extends CollaboratorCreateArgs>(args: SelectSubset<T, CollaboratorCreateArgs<ExtArgs>>): Prisma__CollaboratorClient<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Collaborators.
     * @param {CollaboratorCreateManyArgs} args - Arguments to create many Collaborators.
     * @example
     * // Create many Collaborators
     * const collaborator = await prisma.collaborator.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CollaboratorCreateManyArgs>(args?: SelectSubset<T, CollaboratorCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Collaborators and returns the data saved in the database.
     * @param {CollaboratorCreateManyAndReturnArgs} args - Arguments to create many Collaborators.
     * @example
     * // Create many Collaborators
     * const collaborator = await prisma.collaborator.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Collaborators and only return the `id`
     * const collaboratorWithIdOnly = await prisma.collaborator.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CollaboratorCreateManyAndReturnArgs>(args?: SelectSubset<T, CollaboratorCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Collaborator.
     * @param {CollaboratorDeleteArgs} args - Arguments to delete one Collaborator.
     * @example
     * // Delete one Collaborator
     * const Collaborator = await prisma.collaborator.delete({
     *   where: {
     *     // ... filter to delete one Collaborator
     *   }
     * })
     * 
     */
    delete<T extends CollaboratorDeleteArgs>(args: SelectSubset<T, CollaboratorDeleteArgs<ExtArgs>>): Prisma__CollaboratorClient<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Collaborator.
     * @param {CollaboratorUpdateArgs} args - Arguments to update one Collaborator.
     * @example
     * // Update one Collaborator
     * const collaborator = await prisma.collaborator.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CollaboratorUpdateArgs>(args: SelectSubset<T, CollaboratorUpdateArgs<ExtArgs>>): Prisma__CollaboratorClient<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Collaborators.
     * @param {CollaboratorDeleteManyArgs} args - Arguments to filter Collaborators to delete.
     * @example
     * // Delete a few Collaborators
     * const { count } = await prisma.collaborator.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CollaboratorDeleteManyArgs>(args?: SelectSubset<T, CollaboratorDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Collaborators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaboratorUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Collaborators
     * const collaborator = await prisma.collaborator.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CollaboratorUpdateManyArgs>(args: SelectSubset<T, CollaboratorUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Collaborators and returns the data updated in the database.
     * @param {CollaboratorUpdateManyAndReturnArgs} args - Arguments to update many Collaborators.
     * @example
     * // Update many Collaborators
     * const collaborator = await prisma.collaborator.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Collaborators and only return the `id`
     * const collaboratorWithIdOnly = await prisma.collaborator.updateManyAndReturn({
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
    updateManyAndReturn<T extends CollaboratorUpdateManyAndReturnArgs>(args: SelectSubset<T, CollaboratorUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Collaborator.
     * @param {CollaboratorUpsertArgs} args - Arguments to update or create a Collaborator.
     * @example
     * // Update or create a Collaborator
     * const collaborator = await prisma.collaborator.upsert({
     *   create: {
     *     // ... data to create a Collaborator
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Collaborator we want to update
     *   }
     * })
     */
    upsert<T extends CollaboratorUpsertArgs>(args: SelectSubset<T, CollaboratorUpsertArgs<ExtArgs>>): Prisma__CollaboratorClient<$Result.GetResult<Prisma.$CollaboratorPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Collaborators.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaboratorCountArgs} args - Arguments to filter Collaborators to count.
     * @example
     * // Count the number of Collaborators
     * const count = await prisma.collaborator.count({
     *   where: {
     *     // ... the filter for the Collaborators we want to count
     *   }
     * })
    **/
    count<T extends CollaboratorCountArgs>(
      args?: Subset<T, CollaboratorCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CollaboratorCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Collaborator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaboratorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CollaboratorAggregateArgs>(args: Subset<T, CollaboratorAggregateArgs>): Prisma.PrismaPromise<GetCollaboratorAggregateType<T>>

    /**
     * Group by Collaborator.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CollaboratorGroupByArgs} args - Group by arguments.
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
      T extends CollaboratorGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CollaboratorGroupByArgs['orderBy'] }
        : { orderBy?: CollaboratorGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CollaboratorGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCollaboratorGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Collaborator model
   */
  readonly fields: CollaboratorFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Collaborator.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CollaboratorClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    document<T extends DocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DocumentDefaultArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Collaborator model
   */
  interface CollaboratorFieldRefs {
    readonly id: FieldRef<"Collaborator", 'Int'>
    readonly userId: FieldRef<"Collaborator", 'Int'>
    readonly documentId: FieldRef<"Collaborator", 'Int'>
    readonly role: FieldRef<"Collaborator", 'Role'>
    readonly createdAt: FieldRef<"Collaborator", 'DateTime'>
    readonly updatedAt: FieldRef<"Collaborator", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Collaborator findUnique
   */
  export type CollaboratorFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which Collaborator to fetch.
     */
    where: CollaboratorWhereUniqueInput
  }

  /**
   * Collaborator findUniqueOrThrow
   */
  export type CollaboratorFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which Collaborator to fetch.
     */
    where: CollaboratorWhereUniqueInput
  }

  /**
   * Collaborator findFirst
   */
  export type CollaboratorFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which Collaborator to fetch.
     */
    where?: CollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collaborators to fetch.
     */
    orderBy?: CollaboratorOrderByWithRelationInput | CollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Collaborators.
     */
    cursor?: CollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collaborators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Collaborators.
     */
    distinct?: CollaboratorScalarFieldEnum | CollaboratorScalarFieldEnum[]
  }

  /**
   * Collaborator findFirstOrThrow
   */
  export type CollaboratorFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which Collaborator to fetch.
     */
    where?: CollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collaborators to fetch.
     */
    orderBy?: CollaboratorOrderByWithRelationInput | CollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Collaborators.
     */
    cursor?: CollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collaborators.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Collaborators.
     */
    distinct?: CollaboratorScalarFieldEnum | CollaboratorScalarFieldEnum[]
  }

  /**
   * Collaborator findMany
   */
  export type CollaboratorFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorInclude<ExtArgs> | null
    /**
     * Filter, which Collaborators to fetch.
     */
    where?: CollaboratorWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Collaborators to fetch.
     */
    orderBy?: CollaboratorOrderByWithRelationInput | CollaboratorOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Collaborators.
     */
    cursor?: CollaboratorWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Collaborators from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Collaborators.
     */
    skip?: number
    distinct?: CollaboratorScalarFieldEnum | CollaboratorScalarFieldEnum[]
  }

  /**
   * Collaborator create
   */
  export type CollaboratorCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorInclude<ExtArgs> | null
    /**
     * The data needed to create a Collaborator.
     */
    data: XOR<CollaboratorCreateInput, CollaboratorUncheckedCreateInput>
  }

  /**
   * Collaborator createMany
   */
  export type CollaboratorCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Collaborators.
     */
    data: CollaboratorCreateManyInput | CollaboratorCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Collaborator createManyAndReturn
   */
  export type CollaboratorCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * The data used to create many Collaborators.
     */
    data: CollaboratorCreateManyInput | CollaboratorCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Collaborator update
   */
  export type CollaboratorUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorInclude<ExtArgs> | null
    /**
     * The data needed to update a Collaborator.
     */
    data: XOR<CollaboratorUpdateInput, CollaboratorUncheckedUpdateInput>
    /**
     * Choose, which Collaborator to update.
     */
    where: CollaboratorWhereUniqueInput
  }

  /**
   * Collaborator updateMany
   */
  export type CollaboratorUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Collaborators.
     */
    data: XOR<CollaboratorUpdateManyMutationInput, CollaboratorUncheckedUpdateManyInput>
    /**
     * Filter which Collaborators to update
     */
    where?: CollaboratorWhereInput
    /**
     * Limit how many Collaborators to update.
     */
    limit?: number
  }

  /**
   * Collaborator updateManyAndReturn
   */
  export type CollaboratorUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * The data used to update Collaborators.
     */
    data: XOR<CollaboratorUpdateManyMutationInput, CollaboratorUncheckedUpdateManyInput>
    /**
     * Filter which Collaborators to update
     */
    where?: CollaboratorWhereInput
    /**
     * Limit how many Collaborators to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Collaborator upsert
   */
  export type CollaboratorUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorInclude<ExtArgs> | null
    /**
     * The filter to search for the Collaborator to update in case it exists.
     */
    where: CollaboratorWhereUniqueInput
    /**
     * In case the Collaborator found by the `where` argument doesn't exist, create a new Collaborator with this data.
     */
    create: XOR<CollaboratorCreateInput, CollaboratorUncheckedCreateInput>
    /**
     * In case the Collaborator was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CollaboratorUpdateInput, CollaboratorUncheckedUpdateInput>
  }

  /**
   * Collaborator delete
   */
  export type CollaboratorDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorInclude<ExtArgs> | null
    /**
     * Filter which Collaborator to delete.
     */
    where: CollaboratorWhereUniqueInput
  }

  /**
   * Collaborator deleteMany
   */
  export type CollaboratorDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Collaborators to delete
     */
    where?: CollaboratorWhereInput
    /**
     * Limit how many Collaborators to delete.
     */
    limit?: number
  }

  /**
   * Collaborator without action
   */
  export type CollaboratorDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Collaborator
     */
    select?: CollaboratorSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Collaborator
     */
    omit?: CollaboratorOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CollaboratorInclude<ExtArgs> | null
  }


  /**
   * Model DocumentState
   */

  export type AggregateDocumentState = {
    _count: DocumentStateCountAggregateOutputType | null
    _avg: DocumentStateAvgAggregateOutputType | null
    _sum: DocumentStateSumAggregateOutputType | null
    _min: DocumentStateMinAggregateOutputType | null
    _max: DocumentStateMaxAggregateOutputType | null
  }

  export type DocumentStateAvgAggregateOutputType = {
    id: number | null
    documentId: number | null
  }

  export type DocumentStateSumAggregateOutputType = {
    id: number | null
    documentId: number | null
  }

  export type DocumentStateMinAggregateOutputType = {
    id: number | null
    documentId: number | null
    state: Uint8Array | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentStateMaxAggregateOutputType = {
    id: number | null
    documentId: number | null
    state: Uint8Array | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentStateCountAggregateOutputType = {
    id: number
    documentId: number
    state: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentStateAvgAggregateInputType = {
    id?: true
    documentId?: true
  }

  export type DocumentStateSumAggregateInputType = {
    id?: true
    documentId?: true
  }

  export type DocumentStateMinAggregateInputType = {
    id?: true
    documentId?: true
    state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentStateMaxAggregateInputType = {
    id?: true
    documentId?: true
    state?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentStateCountAggregateInputType = {
    id?: true
    documentId?: true
    state?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DocumentState to aggregate.
     */
    where?: DocumentStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentStates to fetch.
     */
    orderBy?: DocumentStateOrderByWithRelationInput | DocumentStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DocumentStates
    **/
    _count?: true | DocumentStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentStateMaxAggregateInputType
  }

  export type GetDocumentStateAggregateType<T extends DocumentStateAggregateArgs> = {
        [P in keyof T & keyof AggregateDocumentState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocumentState[P]>
      : GetScalarType<T[P], AggregateDocumentState[P]>
  }




  export type DocumentStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentStateWhereInput
    orderBy?: DocumentStateOrderByWithAggregationInput | DocumentStateOrderByWithAggregationInput[]
    by: DocumentStateScalarFieldEnum[] | DocumentStateScalarFieldEnum
    having?: DocumentStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentStateCountAggregateInputType | true
    _avg?: DocumentStateAvgAggregateInputType
    _sum?: DocumentStateSumAggregateInputType
    _min?: DocumentStateMinAggregateInputType
    _max?: DocumentStateMaxAggregateInputType
  }

  export type DocumentStateGroupByOutputType = {
    id: number
    documentId: number
    state: Uint8Array
    createdAt: Date
    updatedAt: Date
    _count: DocumentStateCountAggregateOutputType | null
    _avg: DocumentStateAvgAggregateOutputType | null
    _sum: DocumentStateSumAggregateOutputType | null
    _min: DocumentStateMinAggregateOutputType | null
    _max: DocumentStateMaxAggregateOutputType | null
  }

  type GetDocumentStateGroupByPayload<T extends DocumentStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentStateGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentStateGroupByOutputType[P]>
        }
      >
    >


  export type DocumentStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["documentState"]>

  export type DocumentStateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["documentState"]>

  export type DocumentStateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    documentId?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["documentState"]>

  export type DocumentStateSelectScalar = {
    id?: boolean
    documentId?: boolean
    state?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentStateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "documentId" | "state" | "createdAt" | "updatedAt", ExtArgs["result"]["documentState"]>
  export type DocumentStateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type DocumentStateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type DocumentStateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }

  export type $DocumentStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DocumentState"
    objects: {
      document: Prisma.$DocumentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      documentId: number
      state: Uint8Array
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["documentState"]>
    composites: {}
  }

  type DocumentStateGetPayload<S extends boolean | null | undefined | DocumentStateDefaultArgs> = $Result.GetResult<Prisma.$DocumentStatePayload, S>

  type DocumentStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentStateCountAggregateInputType | true
    }

  export interface DocumentStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DocumentState'], meta: { name: 'DocumentState' } }
    /**
     * Find zero or one DocumentState that matches the filter.
     * @param {DocumentStateFindUniqueArgs} args - Arguments to find a DocumentState
     * @example
     * // Get one DocumentState
     * const documentState = await prisma.documentState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentStateFindUniqueArgs>(args: SelectSubset<T, DocumentStateFindUniqueArgs<ExtArgs>>): Prisma__DocumentStateClient<$Result.GetResult<Prisma.$DocumentStatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DocumentState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentStateFindUniqueOrThrowArgs} args - Arguments to find a DocumentState
     * @example
     * // Get one DocumentState
     * const documentState = await prisma.documentState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentStateFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentStateClient<$Result.GetResult<Prisma.$DocumentStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DocumentState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentStateFindFirstArgs} args - Arguments to find a DocumentState
     * @example
     * // Get one DocumentState
     * const documentState = await prisma.documentState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentStateFindFirstArgs>(args?: SelectSubset<T, DocumentStateFindFirstArgs<ExtArgs>>): Prisma__DocumentStateClient<$Result.GetResult<Prisma.$DocumentStatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DocumentState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentStateFindFirstOrThrowArgs} args - Arguments to find a DocumentState
     * @example
     * // Get one DocumentState
     * const documentState = await prisma.documentState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentStateFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentStateClient<$Result.GetResult<Prisma.$DocumentStatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DocumentStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DocumentStates
     * const documentStates = await prisma.documentState.findMany()
     * 
     * // Get first 10 DocumentStates
     * const documentStates = await prisma.documentState.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentStateWithIdOnly = await prisma.documentState.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentStateFindManyArgs>(args?: SelectSubset<T, DocumentStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentStatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DocumentState.
     * @param {DocumentStateCreateArgs} args - Arguments to create a DocumentState.
     * @example
     * // Create one DocumentState
     * const DocumentState = await prisma.documentState.create({
     *   data: {
     *     // ... data to create a DocumentState
     *   }
     * })
     * 
     */
    create<T extends DocumentStateCreateArgs>(args: SelectSubset<T, DocumentStateCreateArgs<ExtArgs>>): Prisma__DocumentStateClient<$Result.GetResult<Prisma.$DocumentStatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DocumentStates.
     * @param {DocumentStateCreateManyArgs} args - Arguments to create many DocumentStates.
     * @example
     * // Create many DocumentStates
     * const documentState = await prisma.documentState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentStateCreateManyArgs>(args?: SelectSubset<T, DocumentStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DocumentStates and returns the data saved in the database.
     * @param {DocumentStateCreateManyAndReturnArgs} args - Arguments to create many DocumentStates.
     * @example
     * // Create many DocumentStates
     * const documentState = await prisma.documentState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DocumentStates and only return the `id`
     * const documentStateWithIdOnly = await prisma.documentState.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentStateCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentStatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DocumentState.
     * @param {DocumentStateDeleteArgs} args - Arguments to delete one DocumentState.
     * @example
     * // Delete one DocumentState
     * const DocumentState = await prisma.documentState.delete({
     *   where: {
     *     // ... filter to delete one DocumentState
     *   }
     * })
     * 
     */
    delete<T extends DocumentStateDeleteArgs>(args: SelectSubset<T, DocumentStateDeleteArgs<ExtArgs>>): Prisma__DocumentStateClient<$Result.GetResult<Prisma.$DocumentStatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DocumentState.
     * @param {DocumentStateUpdateArgs} args - Arguments to update one DocumentState.
     * @example
     * // Update one DocumentState
     * const documentState = await prisma.documentState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentStateUpdateArgs>(args: SelectSubset<T, DocumentStateUpdateArgs<ExtArgs>>): Prisma__DocumentStateClient<$Result.GetResult<Prisma.$DocumentStatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DocumentStates.
     * @param {DocumentStateDeleteManyArgs} args - Arguments to filter DocumentStates to delete.
     * @example
     * // Delete a few DocumentStates
     * const { count } = await prisma.documentState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentStateDeleteManyArgs>(args?: SelectSubset<T, DocumentStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DocumentStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DocumentStates
     * const documentState = await prisma.documentState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentStateUpdateManyArgs>(args: SelectSubset<T, DocumentStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DocumentStates and returns the data updated in the database.
     * @param {DocumentStateUpdateManyAndReturnArgs} args - Arguments to update many DocumentStates.
     * @example
     * // Update many DocumentStates
     * const documentState = await prisma.documentState.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DocumentStates and only return the `id`
     * const documentStateWithIdOnly = await prisma.documentState.updateManyAndReturn({
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
    updateManyAndReturn<T extends DocumentStateUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentStateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentStatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DocumentState.
     * @param {DocumentStateUpsertArgs} args - Arguments to update or create a DocumentState.
     * @example
     * // Update or create a DocumentState
     * const documentState = await prisma.documentState.upsert({
     *   create: {
     *     // ... data to create a DocumentState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DocumentState we want to update
     *   }
     * })
     */
    upsert<T extends DocumentStateUpsertArgs>(args: SelectSubset<T, DocumentStateUpsertArgs<ExtArgs>>): Prisma__DocumentStateClient<$Result.GetResult<Prisma.$DocumentStatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DocumentStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentStateCountArgs} args - Arguments to filter DocumentStates to count.
     * @example
     * // Count the number of DocumentStates
     * const count = await prisma.documentState.count({
     *   where: {
     *     // ... the filter for the DocumentStates we want to count
     *   }
     * })
    **/
    count<T extends DocumentStateCountArgs>(
      args?: Subset<T, DocumentStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DocumentState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends DocumentStateAggregateArgs>(args: Subset<T, DocumentStateAggregateArgs>): Prisma.PrismaPromise<GetDocumentStateAggregateType<T>>

    /**
     * Group by DocumentState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentStateGroupByArgs} args - Group by arguments.
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
      T extends DocumentStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentStateGroupByArgs['orderBy'] }
        : { orderBy?: DocumentStateGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, DocumentStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DocumentState model
   */
  readonly fields: DocumentStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DocumentState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    document<T extends DocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DocumentDefaultArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the DocumentState model
   */
  interface DocumentStateFieldRefs {
    readonly id: FieldRef<"DocumentState", 'Int'>
    readonly documentId: FieldRef<"DocumentState", 'Int'>
    readonly state: FieldRef<"DocumentState", 'Bytes'>
    readonly createdAt: FieldRef<"DocumentState", 'DateTime'>
    readonly updatedAt: FieldRef<"DocumentState", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DocumentState findUnique
   */
  export type DocumentStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateInclude<ExtArgs> | null
    /**
     * Filter, which DocumentState to fetch.
     */
    where: DocumentStateWhereUniqueInput
  }

  /**
   * DocumentState findUniqueOrThrow
   */
  export type DocumentStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateInclude<ExtArgs> | null
    /**
     * Filter, which DocumentState to fetch.
     */
    where: DocumentStateWhereUniqueInput
  }

  /**
   * DocumentState findFirst
   */
  export type DocumentStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateInclude<ExtArgs> | null
    /**
     * Filter, which DocumentState to fetch.
     */
    where?: DocumentStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentStates to fetch.
     */
    orderBy?: DocumentStateOrderByWithRelationInput | DocumentStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DocumentStates.
     */
    cursor?: DocumentStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocumentStates.
     */
    distinct?: DocumentStateScalarFieldEnum | DocumentStateScalarFieldEnum[]
  }

  /**
   * DocumentState findFirstOrThrow
   */
  export type DocumentStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateInclude<ExtArgs> | null
    /**
     * Filter, which DocumentState to fetch.
     */
    where?: DocumentStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentStates to fetch.
     */
    orderBy?: DocumentStateOrderByWithRelationInput | DocumentStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DocumentStates.
     */
    cursor?: DocumentStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DocumentStates.
     */
    distinct?: DocumentStateScalarFieldEnum | DocumentStateScalarFieldEnum[]
  }

  /**
   * DocumentState findMany
   */
  export type DocumentStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateInclude<ExtArgs> | null
    /**
     * Filter, which DocumentStates to fetch.
     */
    where?: DocumentStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DocumentStates to fetch.
     */
    orderBy?: DocumentStateOrderByWithRelationInput | DocumentStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DocumentStates.
     */
    cursor?: DocumentStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DocumentStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DocumentStates.
     */
    skip?: number
    distinct?: DocumentStateScalarFieldEnum | DocumentStateScalarFieldEnum[]
  }

  /**
   * DocumentState create
   */
  export type DocumentStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateInclude<ExtArgs> | null
    /**
     * The data needed to create a DocumentState.
     */
    data: XOR<DocumentStateCreateInput, DocumentStateUncheckedCreateInput>
  }

  /**
   * DocumentState createMany
   */
  export type DocumentStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DocumentStates.
     */
    data: DocumentStateCreateManyInput | DocumentStateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DocumentState createManyAndReturn
   */
  export type DocumentStateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * The data used to create many DocumentStates.
     */
    data: DocumentStateCreateManyInput | DocumentStateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DocumentState update
   */
  export type DocumentStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateInclude<ExtArgs> | null
    /**
     * The data needed to update a DocumentState.
     */
    data: XOR<DocumentStateUpdateInput, DocumentStateUncheckedUpdateInput>
    /**
     * Choose, which DocumentState to update.
     */
    where: DocumentStateWhereUniqueInput
  }

  /**
   * DocumentState updateMany
   */
  export type DocumentStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DocumentStates.
     */
    data: XOR<DocumentStateUpdateManyMutationInput, DocumentStateUncheckedUpdateManyInput>
    /**
     * Filter which DocumentStates to update
     */
    where?: DocumentStateWhereInput
    /**
     * Limit how many DocumentStates to update.
     */
    limit?: number
  }

  /**
   * DocumentState updateManyAndReturn
   */
  export type DocumentStateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * The data used to update DocumentStates.
     */
    data: XOR<DocumentStateUpdateManyMutationInput, DocumentStateUncheckedUpdateManyInput>
    /**
     * Filter which DocumentStates to update
     */
    where?: DocumentStateWhereInput
    /**
     * Limit how many DocumentStates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DocumentState upsert
   */
  export type DocumentStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateInclude<ExtArgs> | null
    /**
     * The filter to search for the DocumentState to update in case it exists.
     */
    where: DocumentStateWhereUniqueInput
    /**
     * In case the DocumentState found by the `where` argument doesn't exist, create a new DocumentState with this data.
     */
    create: XOR<DocumentStateCreateInput, DocumentStateUncheckedCreateInput>
    /**
     * In case the DocumentState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentStateUpdateInput, DocumentStateUncheckedUpdateInput>
  }

  /**
   * DocumentState delete
   */
  export type DocumentStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateInclude<ExtArgs> | null
    /**
     * Filter which DocumentState to delete.
     */
    where: DocumentStateWhereUniqueInput
  }

  /**
   * DocumentState deleteMany
   */
  export type DocumentStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DocumentStates to delete
     */
    where?: DocumentStateWhereInput
    /**
     * Limit how many DocumentStates to delete.
     */
    limit?: number
  }

  /**
   * DocumentState without action
   */
  export type DocumentStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DocumentState
     */
    select?: DocumentStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DocumentState
     */
    omit?: DocumentStateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentStateInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _avg: MessageAvgAggregateOutputType | null
    _sum: MessageSumAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    documentId: number | null
  }

  export type MessageSumAggregateOutputType = {
    id: number | null
    userId: number | null
    documentId: number | null
  }

  export type MessageMinAggregateOutputType = {
    id: number | null
    content: string | null
    userId: number | null
    documentId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: number | null
    content: string | null
    userId: number | null
    documentId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    content: number
    userId: number
    documentId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MessageAvgAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
  }

  export type MessageSumAggregateInputType = {
    id?: true
    userId?: true
    documentId?: true
  }

  export type MessageMinAggregateInputType = {
    id?: true
    content?: true
    userId?: true
    documentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    content?: true
    userId?: true
    documentId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    content?: true
    userId?: true
    documentId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MessageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MessageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _avg?: MessageAvgAggregateInputType
    _sum?: MessageSumAggregateInputType
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: number
    content: string
    userId: number
    documentId: number
    createdAt: Date
    updatedAt: Date
    _count: MessageCountAggregateOutputType | null
    _avg: MessageAvgAggregateOutputType | null
    _sum: MessageSumAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    userId?: boolean
    documentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    userId?: boolean
    documentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    userId?: boolean
    documentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    content?: boolean
    userId?: boolean
    documentId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "userId" | "documentId" | "createdAt" | "updatedAt", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }
  export type MessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    document?: boolean | DocumentDefaultArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      document: Prisma.$DocumentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      content: string
      userId: number
      documentId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
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
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
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
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    document<T extends DocumentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DocumentDefaultArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'Int'>
    readonly content: FieldRef<"Message", 'String'>
    readonly userId: FieldRef<"Message", 'Int'>
    readonly documentId: FieldRef<"Message", 'Int'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
    readonly updatedAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
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
    name: 'name',
    password: 'password',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    title: 'title',
    ownerId: 'ownerId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const CollaboratorScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    documentId: 'documentId',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CollaboratorScalarFieldEnum = (typeof CollaboratorScalarFieldEnum)[keyof typeof CollaboratorScalarFieldEnum]


  export const DocumentStateScalarFieldEnum: {
    id: 'id',
    documentId: 'documentId',
    state: 'state',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentStateScalarFieldEnum = (typeof DocumentStateScalarFieldEnum)[keyof typeof DocumentStateScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    content: 'content',
    userId: 'userId',
    documentId: 'documentId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


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
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


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
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>
    


  /**
   * Reference to a field of type 'Bytes[]'
   */
  export type ListBytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes[]'>
    


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
    id?: IntFilter<"User"> | number
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    documents?: DocumentListRelationFilter
    collaborations?: CollaboratorListRelationFilter
    messages?: MessageListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    documents?: DocumentOrderByRelationAggregateInput
    collaborations?: CollaboratorOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    documents?: DocumentListRelationFilter
    collaborations?: CollaboratorListRelationFilter
    messages?: MessageListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: IntFilter<"Document"> | number
    title?: StringFilter<"Document"> | string
    ownerId?: IntFilter<"Document"> | number
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    collaborators?: CollaboratorListRelationFilter
    messages?: MessageListRelationFilter
    state?: XOR<DocumentStateNullableScalarRelationFilter, DocumentStateWhereInput> | null
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    owner?: UserOrderByWithRelationInput
    collaborators?: CollaboratorOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
    state?: DocumentStateOrderByWithRelationInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    title?: StringFilter<"Document"> | string
    ownerId?: IntFilter<"Document"> | number
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    owner?: XOR<UserScalarRelationFilter, UserWhereInput>
    collaborators?: CollaboratorListRelationFilter
    messages?: MessageListRelationFilter
    state?: XOR<DocumentStateNullableScalarRelationFilter, DocumentStateWhereInput> | null
  }, "id">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _avg?: DocumentAvgOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
    _sum?: DocumentSumOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Document"> | number
    title?: StringWithAggregatesFilter<"Document"> | string
    ownerId?: IntWithAggregatesFilter<"Document"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type CollaboratorWhereInput = {
    AND?: CollaboratorWhereInput | CollaboratorWhereInput[]
    OR?: CollaboratorWhereInput[]
    NOT?: CollaboratorWhereInput | CollaboratorWhereInput[]
    id?: IntFilter<"Collaborator"> | number
    userId?: IntFilter<"Collaborator"> | number
    documentId?: IntFilter<"Collaborator"> | number
    role?: EnumRoleFilter<"Collaborator"> | $Enums.Role
    createdAt?: DateTimeFilter<"Collaborator"> | Date | string
    updatedAt?: DateTimeFilter<"Collaborator"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    document?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
  }

  export type CollaboratorOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    document?: DocumentOrderByWithRelationInput
  }

  export type CollaboratorWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId_documentId?: CollaboratorUserIdDocumentIdCompoundUniqueInput
    AND?: CollaboratorWhereInput | CollaboratorWhereInput[]
    OR?: CollaboratorWhereInput[]
    NOT?: CollaboratorWhereInput | CollaboratorWhereInput[]
    userId?: IntFilter<"Collaborator"> | number
    documentId?: IntFilter<"Collaborator"> | number
    role?: EnumRoleFilter<"Collaborator"> | $Enums.Role
    createdAt?: DateTimeFilter<"Collaborator"> | Date | string
    updatedAt?: DateTimeFilter<"Collaborator"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    document?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
  }, "id" | "userId_documentId">

  export type CollaboratorOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CollaboratorCountOrderByAggregateInput
    _avg?: CollaboratorAvgOrderByAggregateInput
    _max?: CollaboratorMaxOrderByAggregateInput
    _min?: CollaboratorMinOrderByAggregateInput
    _sum?: CollaboratorSumOrderByAggregateInput
  }

  export type CollaboratorScalarWhereWithAggregatesInput = {
    AND?: CollaboratorScalarWhereWithAggregatesInput | CollaboratorScalarWhereWithAggregatesInput[]
    OR?: CollaboratorScalarWhereWithAggregatesInput[]
    NOT?: CollaboratorScalarWhereWithAggregatesInput | CollaboratorScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Collaborator"> | number
    userId?: IntWithAggregatesFilter<"Collaborator"> | number
    documentId?: IntWithAggregatesFilter<"Collaborator"> | number
    role?: EnumRoleWithAggregatesFilter<"Collaborator"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"Collaborator"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Collaborator"> | Date | string
  }

  export type DocumentStateWhereInput = {
    AND?: DocumentStateWhereInput | DocumentStateWhereInput[]
    OR?: DocumentStateWhereInput[]
    NOT?: DocumentStateWhereInput | DocumentStateWhereInput[]
    id?: IntFilter<"DocumentState"> | number
    documentId?: IntFilter<"DocumentState"> | number
    state?: BytesFilter<"DocumentState"> | Uint8Array
    createdAt?: DateTimeFilter<"DocumentState"> | Date | string
    updatedAt?: DateTimeFilter<"DocumentState"> | Date | string
    document?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
  }

  export type DocumentStateOrderByWithRelationInput = {
    id?: SortOrder
    documentId?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    document?: DocumentOrderByWithRelationInput
  }

  export type DocumentStateWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    documentId?: number
    AND?: DocumentStateWhereInput | DocumentStateWhereInput[]
    OR?: DocumentStateWhereInput[]
    NOT?: DocumentStateWhereInput | DocumentStateWhereInput[]
    state?: BytesFilter<"DocumentState"> | Uint8Array
    createdAt?: DateTimeFilter<"DocumentState"> | Date | string
    updatedAt?: DateTimeFilter<"DocumentState"> | Date | string
    document?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
  }, "id" | "documentId">

  export type DocumentStateOrderByWithAggregationInput = {
    id?: SortOrder
    documentId?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentStateCountOrderByAggregateInput
    _avg?: DocumentStateAvgOrderByAggregateInput
    _max?: DocumentStateMaxOrderByAggregateInput
    _min?: DocumentStateMinOrderByAggregateInput
    _sum?: DocumentStateSumOrderByAggregateInput
  }

  export type DocumentStateScalarWhereWithAggregatesInput = {
    AND?: DocumentStateScalarWhereWithAggregatesInput | DocumentStateScalarWhereWithAggregatesInput[]
    OR?: DocumentStateScalarWhereWithAggregatesInput[]
    NOT?: DocumentStateScalarWhereWithAggregatesInput | DocumentStateScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"DocumentState"> | number
    documentId?: IntWithAggregatesFilter<"DocumentState"> | number
    state?: BytesWithAggregatesFilter<"DocumentState"> | Uint8Array
    createdAt?: DateTimeWithAggregatesFilter<"DocumentState"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DocumentState"> | Date | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: IntFilter<"Message"> | number
    content?: StringFilter<"Message"> | string
    userId?: IntFilter<"Message"> | number
    documentId?: IntFilter<"Message"> | number
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    document?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    document?: DocumentOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    content?: StringFilter<"Message"> | string
    userId?: IntFilter<"Message"> | number
    documentId?: IntFilter<"Message"> | number
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    document?: XOR<DocumentScalarRelationFilter, DocumentWhereInput>
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _avg?: MessageAvgOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
    _sum?: MessageSumOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Message"> | number
    content?: StringWithAggregatesFilter<"Message"> | string
    userId?: IntWithAggregatesFilter<"Message"> | number
    documentId?: IntWithAggregatesFilter<"Message"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type UserCreateInput = {
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentCreateNestedManyWithoutOwnerInput
    collaborations?: CollaboratorCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutOwnerInput
    collaborations?: CollaboratorUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUpdateManyWithoutOwnerNestedInput
    collaborations?: CollaboratorUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutOwnerNestedInput
    collaborations?: CollaboratorUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateInput = {
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutDocumentsInput
    collaborators?: CollaboratorCreateNestedManyWithoutDocumentInput
    messages?: MessageCreateNestedManyWithoutDocumentInput
    state?: DocumentStateCreateNestedOneWithoutDocumentInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: number
    title: string
    ownerId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    collaborators?: CollaboratorUncheckedCreateNestedManyWithoutDocumentInput
    messages?: MessageUncheckedCreateNestedManyWithoutDocumentInput
    state?: DocumentStateUncheckedCreateNestedOneWithoutDocumentInput
  }

  export type DocumentUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutDocumentsNestedInput
    collaborators?: CollaboratorUpdateManyWithoutDocumentNestedInput
    messages?: MessageUpdateManyWithoutDocumentNestedInput
    state?: DocumentStateUpdateOneWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    ownerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collaborators?: CollaboratorUncheckedUpdateManyWithoutDocumentNestedInput
    messages?: MessageUncheckedUpdateManyWithoutDocumentNestedInput
    state?: DocumentStateUncheckedUpdateOneWithoutDocumentNestedInput
  }

  export type DocumentCreateManyInput = {
    id?: number
    title: string
    ownerId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    ownerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollaboratorCreateInput = {
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCollaborationsInput
    document: DocumentCreateNestedOneWithoutCollaboratorsInput
  }

  export type CollaboratorUncheckedCreateInput = {
    id?: number
    userId: number
    documentId: number
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollaboratorUpdateInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCollaborationsNestedInput
    document?: DocumentUpdateOneRequiredWithoutCollaboratorsNestedInput
  }

  export type CollaboratorUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    documentId?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollaboratorCreateManyInput = {
    id?: number
    userId: number
    documentId: number
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollaboratorUpdateManyMutationInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollaboratorUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    documentId?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentStateCreateInput = {
    state: Uint8Array
    createdAt?: Date | string
    updatedAt?: Date | string
    document: DocumentCreateNestedOneWithoutStateInput
  }

  export type DocumentStateUncheckedCreateInput = {
    id?: number
    documentId: number
    state: Uint8Array
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentStateUpdateInput = {
    state?: BytesFieldUpdateOperationsInput | Uint8Array
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: DocumentUpdateOneRequiredWithoutStateNestedInput
  }

  export type DocumentStateUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    documentId?: IntFieldUpdateOperationsInput | number
    state?: BytesFieldUpdateOperationsInput | Uint8Array
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentStateCreateManyInput = {
    id?: number
    documentId: number
    state: Uint8Array
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentStateUpdateManyMutationInput = {
    state?: BytesFieldUpdateOperationsInput | Uint8Array
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentStateUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    documentId?: IntFieldUpdateOperationsInput | number
    state?: BytesFieldUpdateOperationsInput | Uint8Array
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateInput = {
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMessagesInput
    document: DocumentCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: number
    content: string
    userId: number
    documentId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageUpdateInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMessagesNestedInput
    document?: DocumentUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    documentId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyInput = {
    id?: number
    content: string
    userId: number
    documentId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    documentId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type DocumentListRelationFilter = {
    every?: DocumentWhereInput
    some?: DocumentWhereInput
    none?: DocumentWhereInput
  }

  export type CollaboratorListRelationFilter = {
    every?: CollaboratorWhereInput
    some?: CollaboratorWhereInput
    none?: CollaboratorWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CollaboratorOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
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

  export type DocumentStateNullableScalarRelationFilter = {
    is?: DocumentStateWhereInput | null
    isNot?: DocumentStateWhereInput | null
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentAvgOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    ownerId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentSumOrderByAggregateInput = {
    id?: SortOrder
    ownerId?: SortOrder
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DocumentScalarRelationFilter = {
    is?: DocumentWhereInput
    isNot?: DocumentWhereInput
  }

  export type CollaboratorUserIdDocumentIdCompoundUniqueInput = {
    userId: number
    documentId: number
  }

  export type CollaboratorCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollaboratorAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
  }

  export type CollaboratorMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollaboratorMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CollaboratorSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BytesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesFilter<$PrismaModel> | Uint8Array
  }

  export type DocumentStateCountOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentStateAvgOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
  }

  export type DocumentStateMaxOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentStateMinOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
    state?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentStateSumOrderByAggregateInput = {
    id?: SortOrder
    documentId?: SortOrder
  }

  export type BytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Uint8Array
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MessageAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MessageSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    documentId?: SortOrder
  }

  export type DocumentCreateNestedManyWithoutOwnerInput = {
    create?: XOR<DocumentCreateWithoutOwnerInput, DocumentUncheckedCreateWithoutOwnerInput> | DocumentCreateWithoutOwnerInput[] | DocumentUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutOwnerInput | DocumentCreateOrConnectWithoutOwnerInput[]
    createMany?: DocumentCreateManyOwnerInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type CollaboratorCreateNestedManyWithoutUserInput = {
    create?: XOR<CollaboratorCreateWithoutUserInput, CollaboratorUncheckedCreateWithoutUserInput> | CollaboratorCreateWithoutUserInput[] | CollaboratorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CollaboratorCreateOrConnectWithoutUserInput | CollaboratorCreateOrConnectWithoutUserInput[]
    createMany?: CollaboratorCreateManyUserInputEnvelope
    connect?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutUserInput = {
    create?: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput> | MessageCreateWithoutUserInput[] | MessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutUserInput | MessageCreateOrConnectWithoutUserInput[]
    createMany?: MessageCreateManyUserInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type DocumentUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: XOR<DocumentCreateWithoutOwnerInput, DocumentUncheckedCreateWithoutOwnerInput> | DocumentCreateWithoutOwnerInput[] | DocumentUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutOwnerInput | DocumentCreateOrConnectWithoutOwnerInput[]
    createMany?: DocumentCreateManyOwnerInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type CollaboratorUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<CollaboratorCreateWithoutUserInput, CollaboratorUncheckedCreateWithoutUserInput> | CollaboratorCreateWithoutUserInput[] | CollaboratorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CollaboratorCreateOrConnectWithoutUserInput | CollaboratorCreateOrConnectWithoutUserInput[]
    createMany?: CollaboratorCreateManyUserInputEnvelope
    connect?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput> | MessageCreateWithoutUserInput[] | MessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutUserInput | MessageCreateOrConnectWithoutUserInput[]
    createMany?: MessageCreateManyUserInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DocumentUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<DocumentCreateWithoutOwnerInput, DocumentUncheckedCreateWithoutOwnerInput> | DocumentCreateWithoutOwnerInput[] | DocumentUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutOwnerInput | DocumentCreateOrConnectWithoutOwnerInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutOwnerInput | DocumentUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: DocumentCreateManyOwnerInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutOwnerInput | DocumentUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutOwnerInput | DocumentUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type CollaboratorUpdateManyWithoutUserNestedInput = {
    create?: XOR<CollaboratorCreateWithoutUserInput, CollaboratorUncheckedCreateWithoutUserInput> | CollaboratorCreateWithoutUserInput[] | CollaboratorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CollaboratorCreateOrConnectWithoutUserInput | CollaboratorCreateOrConnectWithoutUserInput[]
    upsert?: CollaboratorUpsertWithWhereUniqueWithoutUserInput | CollaboratorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CollaboratorCreateManyUserInputEnvelope
    set?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    disconnect?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    delete?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    connect?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    update?: CollaboratorUpdateWithWhereUniqueWithoutUserInput | CollaboratorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CollaboratorUpdateManyWithWhereWithoutUserInput | CollaboratorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CollaboratorScalarWhereInput | CollaboratorScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutUserNestedInput = {
    create?: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput> | MessageCreateWithoutUserInput[] | MessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutUserInput | MessageCreateOrConnectWithoutUserInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutUserInput | MessageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MessageCreateManyUserInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutUserInput | MessageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutUserInput | MessageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DocumentUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: XOR<DocumentCreateWithoutOwnerInput, DocumentUncheckedCreateWithoutOwnerInput> | DocumentCreateWithoutOwnerInput[] | DocumentUncheckedCreateWithoutOwnerInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutOwnerInput | DocumentCreateOrConnectWithoutOwnerInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutOwnerInput | DocumentUpsertWithWhereUniqueWithoutOwnerInput[]
    createMany?: DocumentCreateManyOwnerInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutOwnerInput | DocumentUpdateWithWhereUniqueWithoutOwnerInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutOwnerInput | DocumentUpdateManyWithWhereWithoutOwnerInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type CollaboratorUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<CollaboratorCreateWithoutUserInput, CollaboratorUncheckedCreateWithoutUserInput> | CollaboratorCreateWithoutUserInput[] | CollaboratorUncheckedCreateWithoutUserInput[]
    connectOrCreate?: CollaboratorCreateOrConnectWithoutUserInput | CollaboratorCreateOrConnectWithoutUserInput[]
    upsert?: CollaboratorUpsertWithWhereUniqueWithoutUserInput | CollaboratorUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: CollaboratorCreateManyUserInputEnvelope
    set?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    disconnect?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    delete?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    connect?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    update?: CollaboratorUpdateWithWhereUniqueWithoutUserInput | CollaboratorUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: CollaboratorUpdateManyWithWhereWithoutUserInput | CollaboratorUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: CollaboratorScalarWhereInput | CollaboratorScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput> | MessageCreateWithoutUserInput[] | MessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutUserInput | MessageCreateOrConnectWithoutUserInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutUserInput | MessageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MessageCreateManyUserInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutUserInput | MessageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutUserInput | MessageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDocumentsInput
    connect?: UserWhereUniqueInput
  }

  export type CollaboratorCreateNestedManyWithoutDocumentInput = {
    create?: XOR<CollaboratorCreateWithoutDocumentInput, CollaboratorUncheckedCreateWithoutDocumentInput> | CollaboratorCreateWithoutDocumentInput[] | CollaboratorUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: CollaboratorCreateOrConnectWithoutDocumentInput | CollaboratorCreateOrConnectWithoutDocumentInput[]
    createMany?: CollaboratorCreateManyDocumentInputEnvelope
    connect?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutDocumentInput = {
    create?: XOR<MessageCreateWithoutDocumentInput, MessageUncheckedCreateWithoutDocumentInput> | MessageCreateWithoutDocumentInput[] | MessageUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutDocumentInput | MessageCreateOrConnectWithoutDocumentInput[]
    createMany?: MessageCreateManyDocumentInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type DocumentStateCreateNestedOneWithoutDocumentInput = {
    create?: XOR<DocumentStateCreateWithoutDocumentInput, DocumentStateUncheckedCreateWithoutDocumentInput>
    connectOrCreate?: DocumentStateCreateOrConnectWithoutDocumentInput
    connect?: DocumentStateWhereUniqueInput
  }

  export type CollaboratorUncheckedCreateNestedManyWithoutDocumentInput = {
    create?: XOR<CollaboratorCreateWithoutDocumentInput, CollaboratorUncheckedCreateWithoutDocumentInput> | CollaboratorCreateWithoutDocumentInput[] | CollaboratorUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: CollaboratorCreateOrConnectWithoutDocumentInput | CollaboratorCreateOrConnectWithoutDocumentInput[]
    createMany?: CollaboratorCreateManyDocumentInputEnvelope
    connect?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutDocumentInput = {
    create?: XOR<MessageCreateWithoutDocumentInput, MessageUncheckedCreateWithoutDocumentInput> | MessageCreateWithoutDocumentInput[] | MessageUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutDocumentInput | MessageCreateOrConnectWithoutDocumentInput[]
    createMany?: MessageCreateManyDocumentInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type DocumentStateUncheckedCreateNestedOneWithoutDocumentInput = {
    create?: XOR<DocumentStateCreateWithoutDocumentInput, DocumentStateUncheckedCreateWithoutDocumentInput>
    connectOrCreate?: DocumentStateCreateOrConnectWithoutDocumentInput
    connect?: DocumentStateWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDocumentsInput
    upsert?: UserUpsertWithoutDocumentsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDocumentsInput, UserUpdateWithoutDocumentsInput>, UserUncheckedUpdateWithoutDocumentsInput>
  }

  export type CollaboratorUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<CollaboratorCreateWithoutDocumentInput, CollaboratorUncheckedCreateWithoutDocumentInput> | CollaboratorCreateWithoutDocumentInput[] | CollaboratorUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: CollaboratorCreateOrConnectWithoutDocumentInput | CollaboratorCreateOrConnectWithoutDocumentInput[]
    upsert?: CollaboratorUpsertWithWhereUniqueWithoutDocumentInput | CollaboratorUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: CollaboratorCreateManyDocumentInputEnvelope
    set?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    disconnect?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    delete?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    connect?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    update?: CollaboratorUpdateWithWhereUniqueWithoutDocumentInput | CollaboratorUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: CollaboratorUpdateManyWithWhereWithoutDocumentInput | CollaboratorUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: CollaboratorScalarWhereInput | CollaboratorScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<MessageCreateWithoutDocumentInput, MessageUncheckedCreateWithoutDocumentInput> | MessageCreateWithoutDocumentInput[] | MessageUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutDocumentInput | MessageCreateOrConnectWithoutDocumentInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutDocumentInput | MessageUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: MessageCreateManyDocumentInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutDocumentInput | MessageUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutDocumentInput | MessageUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type DocumentStateUpdateOneWithoutDocumentNestedInput = {
    create?: XOR<DocumentStateCreateWithoutDocumentInput, DocumentStateUncheckedCreateWithoutDocumentInput>
    connectOrCreate?: DocumentStateCreateOrConnectWithoutDocumentInput
    upsert?: DocumentStateUpsertWithoutDocumentInput
    disconnect?: DocumentStateWhereInput | boolean
    delete?: DocumentStateWhereInput | boolean
    connect?: DocumentStateWhereUniqueInput
    update?: XOR<XOR<DocumentStateUpdateToOneWithWhereWithoutDocumentInput, DocumentStateUpdateWithoutDocumentInput>, DocumentStateUncheckedUpdateWithoutDocumentInput>
  }

  export type CollaboratorUncheckedUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<CollaboratorCreateWithoutDocumentInput, CollaboratorUncheckedCreateWithoutDocumentInput> | CollaboratorCreateWithoutDocumentInput[] | CollaboratorUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: CollaboratorCreateOrConnectWithoutDocumentInput | CollaboratorCreateOrConnectWithoutDocumentInput[]
    upsert?: CollaboratorUpsertWithWhereUniqueWithoutDocumentInput | CollaboratorUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: CollaboratorCreateManyDocumentInputEnvelope
    set?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    disconnect?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    delete?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    connect?: CollaboratorWhereUniqueInput | CollaboratorWhereUniqueInput[]
    update?: CollaboratorUpdateWithWhereUniqueWithoutDocumentInput | CollaboratorUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: CollaboratorUpdateManyWithWhereWithoutDocumentInput | CollaboratorUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: CollaboratorScalarWhereInput | CollaboratorScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutDocumentNestedInput = {
    create?: XOR<MessageCreateWithoutDocumentInput, MessageUncheckedCreateWithoutDocumentInput> | MessageCreateWithoutDocumentInput[] | MessageUncheckedCreateWithoutDocumentInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutDocumentInput | MessageCreateOrConnectWithoutDocumentInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutDocumentInput | MessageUpsertWithWhereUniqueWithoutDocumentInput[]
    createMany?: MessageCreateManyDocumentInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutDocumentInput | MessageUpdateWithWhereUniqueWithoutDocumentInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutDocumentInput | MessageUpdateManyWithWhereWithoutDocumentInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type DocumentStateUncheckedUpdateOneWithoutDocumentNestedInput = {
    create?: XOR<DocumentStateCreateWithoutDocumentInput, DocumentStateUncheckedCreateWithoutDocumentInput>
    connectOrCreate?: DocumentStateCreateOrConnectWithoutDocumentInput
    upsert?: DocumentStateUpsertWithoutDocumentInput
    disconnect?: DocumentStateWhereInput | boolean
    delete?: DocumentStateWhereInput | boolean
    connect?: DocumentStateWhereUniqueInput
    update?: XOR<XOR<DocumentStateUpdateToOneWithWhereWithoutDocumentInput, DocumentStateUpdateWithoutDocumentInput>, DocumentStateUncheckedUpdateWithoutDocumentInput>
  }

  export type UserCreateNestedOneWithoutCollaborationsInput = {
    create?: XOR<UserCreateWithoutCollaborationsInput, UserUncheckedCreateWithoutCollaborationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCollaborationsInput
    connect?: UserWhereUniqueInput
  }

  export type DocumentCreateNestedOneWithoutCollaboratorsInput = {
    create?: XOR<DocumentCreateWithoutCollaboratorsInput, DocumentUncheckedCreateWithoutCollaboratorsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutCollaboratorsInput
    connect?: DocumentWhereUniqueInput
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type UserUpdateOneRequiredWithoutCollaborationsNestedInput = {
    create?: XOR<UserCreateWithoutCollaborationsInput, UserUncheckedCreateWithoutCollaborationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCollaborationsInput
    upsert?: UserUpsertWithoutCollaborationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCollaborationsInput, UserUpdateWithoutCollaborationsInput>, UserUncheckedUpdateWithoutCollaborationsInput>
  }

  export type DocumentUpdateOneRequiredWithoutCollaboratorsNestedInput = {
    create?: XOR<DocumentCreateWithoutCollaboratorsInput, DocumentUncheckedCreateWithoutCollaboratorsInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutCollaboratorsInput
    upsert?: DocumentUpsertWithoutCollaboratorsInput
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutCollaboratorsInput, DocumentUpdateWithoutCollaboratorsInput>, DocumentUncheckedUpdateWithoutCollaboratorsInput>
  }

  export type DocumentCreateNestedOneWithoutStateInput = {
    create?: XOR<DocumentCreateWithoutStateInput, DocumentUncheckedCreateWithoutStateInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutStateInput
    connect?: DocumentWhereUniqueInput
  }

  export type BytesFieldUpdateOperationsInput = {
    set?: Uint8Array
  }

  export type DocumentUpdateOneRequiredWithoutStateNestedInput = {
    create?: XOR<DocumentCreateWithoutStateInput, DocumentUncheckedCreateWithoutStateInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutStateInput
    upsert?: DocumentUpsertWithoutStateInput
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutStateInput, DocumentUpdateWithoutStateInput>, DocumentUncheckedUpdateWithoutStateInput>
  }

  export type UserCreateNestedOneWithoutMessagesInput = {
    create?: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput
    connect?: UserWhereUniqueInput
  }

  export type DocumentCreateNestedOneWithoutMessagesInput = {
    create?: XOR<DocumentCreateWithoutMessagesInput, DocumentUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutMessagesInput
    connect?: DocumentWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput
    upsert?: UserUpsertWithoutMessagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMessagesInput, UserUpdateWithoutMessagesInput>, UserUncheckedUpdateWithoutMessagesInput>
  }

  export type DocumentUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<DocumentCreateWithoutMessagesInput, DocumentUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: DocumentCreateOrConnectWithoutMessagesInput
    upsert?: DocumentUpsertWithoutMessagesInput
    connect?: DocumentWhereUniqueInput
    update?: XOR<XOR<DocumentUpdateToOneWithWhereWithoutMessagesInput, DocumentUpdateWithoutMessagesInput>, DocumentUncheckedUpdateWithoutMessagesInput>
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

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedBytesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesFilter<$PrismaModel> | Uint8Array
  }

  export type NestedBytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Uint8Array
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type DocumentCreateWithoutOwnerInput = {
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    collaborators?: CollaboratorCreateNestedManyWithoutDocumentInput
    messages?: MessageCreateNestedManyWithoutDocumentInput
    state?: DocumentStateCreateNestedOneWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutOwnerInput = {
    id?: number
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    collaborators?: CollaboratorUncheckedCreateNestedManyWithoutDocumentInput
    messages?: MessageUncheckedCreateNestedManyWithoutDocumentInput
    state?: DocumentStateUncheckedCreateNestedOneWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutOwnerInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutOwnerInput, DocumentUncheckedCreateWithoutOwnerInput>
  }

  export type DocumentCreateManyOwnerInputEnvelope = {
    data: DocumentCreateManyOwnerInput | DocumentCreateManyOwnerInput[]
    skipDuplicates?: boolean
  }

  export type CollaboratorCreateWithoutUserInput = {
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    document: DocumentCreateNestedOneWithoutCollaboratorsInput
  }

  export type CollaboratorUncheckedCreateWithoutUserInput = {
    id?: number
    documentId: number
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollaboratorCreateOrConnectWithoutUserInput = {
    where: CollaboratorWhereUniqueInput
    create: XOR<CollaboratorCreateWithoutUserInput, CollaboratorUncheckedCreateWithoutUserInput>
  }

  export type CollaboratorCreateManyUserInputEnvelope = {
    data: CollaboratorCreateManyUserInput | CollaboratorCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutUserInput = {
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    document: DocumentCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutUserInput = {
    id?: number
    content: string
    documentId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageCreateOrConnectWithoutUserInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput>
  }

  export type MessageCreateManyUserInputEnvelope = {
    data: MessageCreateManyUserInput | MessageCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DocumentUpsertWithWhereUniqueWithoutOwnerInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutOwnerInput, DocumentUncheckedUpdateWithoutOwnerInput>
    create: XOR<DocumentCreateWithoutOwnerInput, DocumentUncheckedCreateWithoutOwnerInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutOwnerInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutOwnerInput, DocumentUncheckedUpdateWithoutOwnerInput>
  }

  export type DocumentUpdateManyWithWhereWithoutOwnerInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutOwnerInput>
  }

  export type DocumentScalarWhereInput = {
    AND?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    OR?: DocumentScalarWhereInput[]
    NOT?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    id?: IntFilter<"Document"> | number
    title?: StringFilter<"Document"> | string
    ownerId?: IntFilter<"Document"> | number
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
  }

  export type CollaboratorUpsertWithWhereUniqueWithoutUserInput = {
    where: CollaboratorWhereUniqueInput
    update: XOR<CollaboratorUpdateWithoutUserInput, CollaboratorUncheckedUpdateWithoutUserInput>
    create: XOR<CollaboratorCreateWithoutUserInput, CollaboratorUncheckedCreateWithoutUserInput>
  }

  export type CollaboratorUpdateWithWhereUniqueWithoutUserInput = {
    where: CollaboratorWhereUniqueInput
    data: XOR<CollaboratorUpdateWithoutUserInput, CollaboratorUncheckedUpdateWithoutUserInput>
  }

  export type CollaboratorUpdateManyWithWhereWithoutUserInput = {
    where: CollaboratorScalarWhereInput
    data: XOR<CollaboratorUpdateManyMutationInput, CollaboratorUncheckedUpdateManyWithoutUserInput>
  }

  export type CollaboratorScalarWhereInput = {
    AND?: CollaboratorScalarWhereInput | CollaboratorScalarWhereInput[]
    OR?: CollaboratorScalarWhereInput[]
    NOT?: CollaboratorScalarWhereInput | CollaboratorScalarWhereInput[]
    id?: IntFilter<"Collaborator"> | number
    userId?: IntFilter<"Collaborator"> | number
    documentId?: IntFilter<"Collaborator"> | number
    role?: EnumRoleFilter<"Collaborator"> | $Enums.Role
    createdAt?: DateTimeFilter<"Collaborator"> | Date | string
    updatedAt?: DateTimeFilter<"Collaborator"> | Date | string
  }

  export type MessageUpsertWithWhereUniqueWithoutUserInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutUserInput, MessageUncheckedUpdateWithoutUserInput>
    create: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutUserInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutUserInput, MessageUncheckedUpdateWithoutUserInput>
  }

  export type MessageUpdateManyWithWhereWithoutUserInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutUserInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: IntFilter<"Message"> | number
    content?: StringFilter<"Message"> | string
    userId?: IntFilter<"Message"> | number
    documentId?: IntFilter<"Message"> | number
    createdAt?: DateTimeFilter<"Message"> | Date | string
    updatedAt?: DateTimeFilter<"Message"> | Date | string
  }

  export type UserCreateWithoutDocumentsInput = {
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    collaborations?: CollaboratorCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDocumentsInput = {
    id?: number
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    collaborations?: CollaboratorUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDocumentsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
  }

  export type CollaboratorCreateWithoutDocumentInput = {
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCollaborationsInput
  }

  export type CollaboratorUncheckedCreateWithoutDocumentInput = {
    id?: number
    userId: number
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollaboratorCreateOrConnectWithoutDocumentInput = {
    where: CollaboratorWhereUniqueInput
    create: XOR<CollaboratorCreateWithoutDocumentInput, CollaboratorUncheckedCreateWithoutDocumentInput>
  }

  export type CollaboratorCreateManyDocumentInputEnvelope = {
    data: CollaboratorCreateManyDocumentInput | CollaboratorCreateManyDocumentInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutDocumentInput = {
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateWithoutDocumentInput = {
    id?: number
    content: string
    userId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageCreateOrConnectWithoutDocumentInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutDocumentInput, MessageUncheckedCreateWithoutDocumentInput>
  }

  export type MessageCreateManyDocumentInputEnvelope = {
    data: MessageCreateManyDocumentInput | MessageCreateManyDocumentInput[]
    skipDuplicates?: boolean
  }

  export type DocumentStateCreateWithoutDocumentInput = {
    state: Uint8Array
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentStateUncheckedCreateWithoutDocumentInput = {
    id?: number
    state: Uint8Array
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentStateCreateOrConnectWithoutDocumentInput = {
    where: DocumentStateWhereUniqueInput
    create: XOR<DocumentStateCreateWithoutDocumentInput, DocumentStateUncheckedCreateWithoutDocumentInput>
  }

  export type UserUpsertWithoutDocumentsInput = {
    update: XOR<UserUpdateWithoutDocumentsInput, UserUncheckedUpdateWithoutDocumentsInput>
    create: XOR<UserCreateWithoutDocumentsInput, UserUncheckedCreateWithoutDocumentsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDocumentsInput, UserUncheckedUpdateWithoutDocumentsInput>
  }

  export type UserUpdateWithoutDocumentsInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collaborations?: CollaboratorUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDocumentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collaborations?: CollaboratorUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type CollaboratorUpsertWithWhereUniqueWithoutDocumentInput = {
    where: CollaboratorWhereUniqueInput
    update: XOR<CollaboratorUpdateWithoutDocumentInput, CollaboratorUncheckedUpdateWithoutDocumentInput>
    create: XOR<CollaboratorCreateWithoutDocumentInput, CollaboratorUncheckedCreateWithoutDocumentInput>
  }

  export type CollaboratorUpdateWithWhereUniqueWithoutDocumentInput = {
    where: CollaboratorWhereUniqueInput
    data: XOR<CollaboratorUpdateWithoutDocumentInput, CollaboratorUncheckedUpdateWithoutDocumentInput>
  }

  export type CollaboratorUpdateManyWithWhereWithoutDocumentInput = {
    where: CollaboratorScalarWhereInput
    data: XOR<CollaboratorUpdateManyMutationInput, CollaboratorUncheckedUpdateManyWithoutDocumentInput>
  }

  export type MessageUpsertWithWhereUniqueWithoutDocumentInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutDocumentInput, MessageUncheckedUpdateWithoutDocumentInput>
    create: XOR<MessageCreateWithoutDocumentInput, MessageUncheckedCreateWithoutDocumentInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutDocumentInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutDocumentInput, MessageUncheckedUpdateWithoutDocumentInput>
  }

  export type MessageUpdateManyWithWhereWithoutDocumentInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutDocumentInput>
  }

  export type DocumentStateUpsertWithoutDocumentInput = {
    update: XOR<DocumentStateUpdateWithoutDocumentInput, DocumentStateUncheckedUpdateWithoutDocumentInput>
    create: XOR<DocumentStateCreateWithoutDocumentInput, DocumentStateUncheckedCreateWithoutDocumentInput>
    where?: DocumentStateWhereInput
  }

  export type DocumentStateUpdateToOneWithWhereWithoutDocumentInput = {
    where?: DocumentStateWhereInput
    data: XOR<DocumentStateUpdateWithoutDocumentInput, DocumentStateUncheckedUpdateWithoutDocumentInput>
  }

  export type DocumentStateUpdateWithoutDocumentInput = {
    state?: BytesFieldUpdateOperationsInput | Uint8Array
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentStateUncheckedUpdateWithoutDocumentInput = {
    id?: IntFieldUpdateOperationsInput | number
    state?: BytesFieldUpdateOperationsInput | Uint8Array
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutCollaborationsInput = {
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentCreateNestedManyWithoutOwnerInput
    messages?: MessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCollaborationsInput = {
    id?: number
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutOwnerInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCollaborationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCollaborationsInput, UserUncheckedCreateWithoutCollaborationsInput>
  }

  export type DocumentCreateWithoutCollaboratorsInput = {
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutDocumentsInput
    messages?: MessageCreateNestedManyWithoutDocumentInput
    state?: DocumentStateCreateNestedOneWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutCollaboratorsInput = {
    id?: number
    title: string
    ownerId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: MessageUncheckedCreateNestedManyWithoutDocumentInput
    state?: DocumentStateUncheckedCreateNestedOneWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutCollaboratorsInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutCollaboratorsInput, DocumentUncheckedCreateWithoutCollaboratorsInput>
  }

  export type UserUpsertWithoutCollaborationsInput = {
    update: XOR<UserUpdateWithoutCollaborationsInput, UserUncheckedUpdateWithoutCollaborationsInput>
    create: XOR<UserCreateWithoutCollaborationsInput, UserUncheckedCreateWithoutCollaborationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCollaborationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCollaborationsInput, UserUncheckedUpdateWithoutCollaborationsInput>
  }

  export type UserUpdateWithoutCollaborationsInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUpdateManyWithoutOwnerNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCollaborationsInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutOwnerNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DocumentUpsertWithoutCollaboratorsInput = {
    update: XOR<DocumentUpdateWithoutCollaboratorsInput, DocumentUncheckedUpdateWithoutCollaboratorsInput>
    create: XOR<DocumentCreateWithoutCollaboratorsInput, DocumentUncheckedCreateWithoutCollaboratorsInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutCollaboratorsInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutCollaboratorsInput, DocumentUncheckedUpdateWithoutCollaboratorsInput>
  }

  export type DocumentUpdateWithoutCollaboratorsInput = {
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutDocumentsNestedInput
    messages?: MessageUpdateManyWithoutDocumentNestedInput
    state?: DocumentStateUpdateOneWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutCollaboratorsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    ownerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: MessageUncheckedUpdateManyWithoutDocumentNestedInput
    state?: DocumentStateUncheckedUpdateOneWithoutDocumentNestedInput
  }

  export type DocumentCreateWithoutStateInput = {
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutDocumentsInput
    collaborators?: CollaboratorCreateNestedManyWithoutDocumentInput
    messages?: MessageCreateNestedManyWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutStateInput = {
    id?: number
    title: string
    ownerId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    collaborators?: CollaboratorUncheckedCreateNestedManyWithoutDocumentInput
    messages?: MessageUncheckedCreateNestedManyWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutStateInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutStateInput, DocumentUncheckedCreateWithoutStateInput>
  }

  export type DocumentUpsertWithoutStateInput = {
    update: XOR<DocumentUpdateWithoutStateInput, DocumentUncheckedUpdateWithoutStateInput>
    create: XOR<DocumentCreateWithoutStateInput, DocumentUncheckedCreateWithoutStateInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutStateInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutStateInput, DocumentUncheckedUpdateWithoutStateInput>
  }

  export type DocumentUpdateWithoutStateInput = {
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutDocumentsNestedInput
    collaborators?: CollaboratorUpdateManyWithoutDocumentNestedInput
    messages?: MessageUpdateManyWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutStateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    ownerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collaborators?: CollaboratorUncheckedUpdateManyWithoutDocumentNestedInput
    messages?: MessageUncheckedUpdateManyWithoutDocumentNestedInput
  }

  export type UserCreateWithoutMessagesInput = {
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentCreateNestedManyWithoutOwnerInput
    collaborations?: CollaboratorCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMessagesInput = {
    id?: number
    email: string
    name?: string | null
    password: string
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutOwnerInput
    collaborations?: CollaboratorUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMessagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
  }

  export type DocumentCreateWithoutMessagesInput = {
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
    owner: UserCreateNestedOneWithoutDocumentsInput
    collaborators?: CollaboratorCreateNestedManyWithoutDocumentInput
    state?: DocumentStateCreateNestedOneWithoutDocumentInput
  }

  export type DocumentUncheckedCreateWithoutMessagesInput = {
    id?: number
    title: string
    ownerId: number
    createdAt?: Date | string
    updatedAt?: Date | string
    collaborators?: CollaboratorUncheckedCreateNestedManyWithoutDocumentInput
    state?: DocumentStateUncheckedCreateNestedOneWithoutDocumentInput
  }

  export type DocumentCreateOrConnectWithoutMessagesInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutMessagesInput, DocumentUncheckedCreateWithoutMessagesInput>
  }

  export type UserUpsertWithoutMessagesInput = {
    update: XOR<UserUpdateWithoutMessagesInput, UserUncheckedUpdateWithoutMessagesInput>
    create: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMessagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMessagesInput, UserUncheckedUpdateWithoutMessagesInput>
  }

  export type UserUpdateWithoutMessagesInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUpdateManyWithoutOwnerNestedInput
    collaborations?: CollaboratorUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMessagesInput = {
    id?: IntFieldUpdateOperationsInput | number
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutOwnerNestedInput
    collaborations?: CollaboratorUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DocumentUpsertWithoutMessagesInput = {
    update: XOR<DocumentUpdateWithoutMessagesInput, DocumentUncheckedUpdateWithoutMessagesInput>
    create: XOR<DocumentCreateWithoutMessagesInput, DocumentUncheckedCreateWithoutMessagesInput>
    where?: DocumentWhereInput
  }

  export type DocumentUpdateToOneWithWhereWithoutMessagesInput = {
    where?: DocumentWhereInput
    data: XOR<DocumentUpdateWithoutMessagesInput, DocumentUncheckedUpdateWithoutMessagesInput>
  }

  export type DocumentUpdateWithoutMessagesInput = {
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    owner?: UserUpdateOneRequiredWithoutDocumentsNestedInput
    collaborators?: CollaboratorUpdateManyWithoutDocumentNestedInput
    state?: DocumentStateUpdateOneWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutMessagesInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    ownerId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collaborators?: CollaboratorUncheckedUpdateManyWithoutDocumentNestedInput
    state?: DocumentStateUncheckedUpdateOneWithoutDocumentNestedInput
  }

  export type DocumentCreateManyOwnerInput = {
    id?: number
    title: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollaboratorCreateManyUserInput = {
    id?: number
    documentId: number
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageCreateManyUserInput = {
    id?: number
    content: string
    documentId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateWithoutOwnerInput = {
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collaborators?: CollaboratorUpdateManyWithoutDocumentNestedInput
    messages?: MessageUpdateManyWithoutDocumentNestedInput
    state?: DocumentStateUpdateOneWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateWithoutOwnerInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    collaborators?: CollaboratorUncheckedUpdateManyWithoutDocumentNestedInput
    messages?: MessageUncheckedUpdateManyWithoutDocumentNestedInput
    state?: DocumentStateUncheckedUpdateOneWithoutDocumentNestedInput
  }

  export type DocumentUncheckedUpdateManyWithoutOwnerInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollaboratorUpdateWithoutUserInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: DocumentUpdateOneRequiredWithoutCollaboratorsNestedInput
  }

  export type CollaboratorUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    documentId?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollaboratorUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    documentId?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUpdateWithoutUserInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    document?: DocumentUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    documentId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    documentId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollaboratorCreateManyDocumentInput = {
    id?: number
    userId: number
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageCreateManyDocumentInput = {
    id?: number
    content: string
    userId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CollaboratorUpdateWithoutDocumentInput = {
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCollaborationsNestedInput
  }

  export type CollaboratorUncheckedUpdateWithoutDocumentInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CollaboratorUncheckedUpdateManyWithoutDocumentInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUpdateWithoutDocumentInput = {
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateWithoutDocumentInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutDocumentInput = {
    id?: IntFieldUpdateOperationsInput | number
    content?: StringFieldUpdateOperationsInput | string
    userId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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