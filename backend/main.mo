import Bool "mo:base/Bool";
import List "mo:base/List";

import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Option "mo:base/Option";

actor {
    // Types for our shopping list app
    public type ItemId = Nat;
    public type ListId = Nat;
    
    public type Item = {
        id: ItemId;
        description: Text;
        completed: Bool;
    };

    public type List = {
        id: ListId;
        name: Text;
        items: [Item];
    };

    private stable var nextItemId: Nat = 0;
    private stable var nextListId: Nat = 0;
    private stable var listsEntries : [(ListId, List)] = [];

    private var lists = HashMap.HashMap<ListId, List>(1, Nat.equal, Hash.hash);

    public func createList(name : Text) : async ListId {
        let id = nextListId;
        let newList : List = {
            id = id;
            name = name;
            items = [];
        };
        lists.put(id, newList);
        nextListId += 1;
        id
    };

    public query func getLists() : async [List] {
        Iter.toArray(lists.vals())
    };

    public func addItem(listId : ListId, description : Text) : async ?ItemId {
        switch (lists.get(listId)) {
            case (null) { null };
            case (?list) {
                let id = nextItemId;
                let newItem : Item = {
                    id = id;
                    description = description;
                    completed = false;
                };
                let updatedItems = Array.append<Item>(list.items, [newItem]);
                let updatedList : List = {
                    id = list.id;
                    name = list.name;
                    items = updatedItems;
                };
                lists.put(listId, updatedList);
                nextItemId += 1;
                ?id
            };
        }
    };

    public func toggleItem(listId : ListId, itemId : ItemId) : async Bool {
        switch (lists.get(listId)) {
            case (null) { false };
            case (?list) {
                let updatedItems = Array.map<Item, Item>(
                    list.items,
                    func (item : Item) : Item {
                        if (item.id == itemId) {
                            {
                                id = item.id;
                                description = item.description;
                                completed = not item.completed;
                            }
                        } else {
                            item
                        }
                    }
                );
                let updatedList : List = {
                    id = list.id;
                    name = list.name;
                    items = updatedItems;
                };
                lists.put(listId, updatedList);
                true
            };
        }
    };

    public func deleteItem(listId : ListId, itemId : ItemId) : async Bool {
        switch (lists.get(listId)) {
            case (null) { false };
            case (?list) {
                let updatedItems = Array.filter<Item>(
                    list.items,
                    func (item : Item) : Bool { item.id != itemId }
                );
                let updatedList : List = {
                    id = list.id;
                    name = list.name;
                    items = updatedItems;
                };
                lists.put(listId, updatedList);
                true
            };
        }
    };

    system func preupgrade() {
        listsEntries := Iter.toArray(lists.entries());
    };

    system func postupgrade() {
        lists := HashMap.fromIter<ListId, List>(listsEntries.vals(), 1, Nat.equal, Hash.hash);
    };
}
