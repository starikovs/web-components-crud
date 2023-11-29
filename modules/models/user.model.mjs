let nextUserId = 1;

class User {
  id;
  nickname;
  email;
  editingInProgress;
}

export function createEmptyUser(nickname = '', email = '') {
  const user = new User();

  user.nickname = nickname;
  user.email = email;

  return user;
}

export function createUser(nickname, email) {
  const user = new User();

  user.nickname = nickname;
  user.email = email;
  user.id = nextUserId++;
  user.editingInProgress = false;

  return user;
}
