export const idlFactory = ({ IDL }) => {
  const ListId = IDL.Nat;
  const ItemId = IDL.Nat;
  const Item = IDL.Record({
    'id' : ItemId,
    'completed' : IDL.Bool,
    'description' : IDL.Text,
  });
  const List = IDL.Record({
    'id' : ListId,
    'name' : IDL.Text,
    'items' : IDL.Vec(Item),
  });
  return IDL.Service({
    'addItem' : IDL.Func([ListId, IDL.Text], [IDL.Opt(ItemId)], []),
    'createList' : IDL.Func([IDL.Text], [ListId], []),
    'deleteItem' : IDL.Func([ListId, ItemId], [IDL.Bool], []),
    'getLists' : IDL.Func([], [IDL.Vec(List)], ['query']),
    'toggleItem' : IDL.Func([ListId, ItemId], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
