import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Item {
  'id' : ItemId,
  'completed' : boolean,
  'description' : string,
}
export type ItemId = bigint;
export interface List { 'id' : ListId, 'name' : string, 'items' : Array<Item> }
export type ListId = bigint;
export interface _SERVICE {
  'addItem' : ActorMethod<[ListId, string], [] | [ItemId]>,
  'createList' : ActorMethod<[string], ListId>,
  'deleteItem' : ActorMethod<[ListId, ItemId], boolean>,
  'getLists' : ActorMethod<[], Array<List>>,
  'toggleItem' : ActorMethod<[ListId, ItemId], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
