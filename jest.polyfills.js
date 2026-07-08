/* eslint-disable @typescript-eslint/no-require-imports --
   Jest's `setupFiles` are loaded via Node's require() before any ESM
   transform is available, so `import` syntax isn't reliable here.
   This is the standard pattern for Jest polyfill/setup files. */
/**
 * jsdom (the Jest test environment used here) does not implement the
 * Fetch API (Request/Response/Headers/fetch) or some encoding globals.
 * MSW's Node interceptors need these to exist on `globalThis` before
 * anything else runs — hence this file is loaded via `setupFiles`
 * (which runs before `setupFilesAfterEnv` and before the test
 * framework itself), not via `setupFilesAfterEnv`.
 *
 * `configurable: true` is required on every property below: MSW's own
 * interceptors redefine these same globals again later (that's how
 * interception works), and a non-configurable property throws
 * "Cannot redefine property" the second time someone touches it.
 */
const { TextDecoder, TextEncoder } = require("node:util");

Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder, configurable: true },
  TextEncoder: { value: TextEncoder, configurable: true },
});

const { Blob, File } = require("node:buffer");
const { ReadableStream, TransformStream, WritableStream } = require("node:stream/web");
const { MessageChannel, MessagePort } = require("node:worker_threads");

// Must be defined BEFORE requiring "undici" — its fetch implementation
// reads these globals at import time.
Object.defineProperties(globalThis, {
  ReadableStream: { value: ReadableStream, configurable: true },
  TransformStream: { value: TransformStream, configurable: true },
  WritableStream: { value: WritableStream, configurable: true },
  MessageChannel: { value: MessageChannel, configurable: true },
  MessagePort: { value: MessagePort, configurable: true },
});

const { fetch, Headers, FormData, Request, Response } = require("undici");

// MSW's Node interceptors also rely on BroadcastChannel, which jsdom
// doesn't provide either.
const { BroadcastChannel } = require("node:worker_threads");
Object.defineProperty(globalThis, "BroadcastChannel", {
  value: BroadcastChannel,
  configurable: true,
});

Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true, configurable: true },
  Blob: { value: Blob, configurable: true },
  File: { value: File, configurable: true },
  Headers: { value: Headers, configurable: true },
  FormData: { value: FormData, configurable: true },
  Request: { value: Request, configurable: true },
  Response: { value: Response, configurable: true },
});
