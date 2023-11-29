import { createUser, createEmptyUser } from 'models/user.model.mjs';

export const USER_ADDED_EVENT = 'USER_ADDED_EVENT';
export const USER_EDIT_EVENT = 'USER_EDIT_EVENT';
export const USER_UPDATED_EVENT = 'USER_UPDATED_EVENT';
export const USER_DELETED_EVENT = 'USER_DELETED_EVENT';
export const USERS_CHANGED_EVENT = 'USERS_CHANGED_EVENT';

class UserService {
  subscribers = {};

  subscribe(event, callback) {
    if (this.subscribers[event]) {
      this.subscribers[event].push(callback);
    } else {
      this.subscribers[event] = [callback];
    }
  }

  unsubscribe(event, callback) {
    if (!this.subscribers[event]) {
      return;
    }

    const index = this.subscribers[event].indexOf(callback);

    if (index !== -1) {
      this.subscribers[event].splice(index, 1);
    }
  }

  publish(event, data) {
    if (!this.subscribers[event]) {
      return;
    }

    this.subscribers[event].forEach((callback) => {
      callback(data);
    });
  }

  users = [
    createUser('root', 'root@gmail.com'),
    createUser('admin', 'admin@gmail.com'),
    createUser('guest', 'guest@gmail.com'),
  ];

  addUser(user) {
    const newUser = createUser(user.nickname, user.email);
    this.users = [...this.users, newUser];

    this.publish(USER_ADDED_EVENT, newUser);
    this.publish(USERS_CHANGED_EVENT, this.users);
  }

  deleteUser(user) {
    const editingUser = this.users.find((u) => u.editingInProgress);
    this.users = this.users.filter((u) => u.id !== user.id);

    if (editingUser && editingUser.id === user.id) {
      this.publish(USER_EDIT_EVENT, createEmptyUser());
    }

    this.publish(USER_DELETED_EVENT, user);
    this.publish(USERS_CHANGED_EVENT, this.users);
  }

  editUser(user) {
    this.users = this.users.map((u) => {
      if (u.id === user.id) {
        return { ...user, editingInProgress: true };
      }

      return { ...u, editingInProgress: false };
    });

    this.publish(USER_EDIT_EVENT, user);
    this.publish(USERS_CHANGED_EVENT, this.users);
  }

  updateUser(user) {
    this.users = this.users.map((u) => {
      if (u.id === user.id) {
        return { ...user, editingInProgress: false };
      }

      return u;
    });

    this.publish(USER_UPDATED_EVENT, user);
    this.publish(USERS_CHANGED_EVENT, this.users);
  }
}

export default new UserService();
