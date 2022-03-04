import {UserData, UsersArray} from "./types";

const users: UsersArray = [null];


export const addUser = ({ id, name, room }: UserData) => {
    name = name?.trim().toLowerCase();
    room = room?.trim().toLowerCase();

    const existingUser = users.find((user) => user?.room === room && user?.name === name);
    if (existingUser) {
        return {error: new Error('Username is already taken')};
    }

    const user = { id, name, room };
    users.push(user);

    return { user };
}
export const removeUser = ({id}: UserData) => {
    const index = users.findIndex((user) => user?.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    return null;
}

export const getUser = ({id}: UserData) => {
    return users.find((user) => user?.id === id);
};
export const getUsersInRoom = ({room}: UserData) => users
    .filter((user) => user?.room === room)
    .map((user) => user?.name);
