function fetchUserProfile(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        const user = {
        id: userId,
        name: "Kuan Li",
        email: "kuan_li@outlook.com",
        username: "kuan1640969",
        };
        resolve(user);
    }, 1000);
  });
}

function fetchUserPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        const posts = [
        { postId: 1, userId: userId, title: 'Post1', content: 'Coffee' },
        { postId: 2, userId: userId, title: 'Post2', content: 'Steak' },
        { postId: 3, userId: userId, title: 'Post3', content: 'Sous Vide' },
        ];
        resolve(posts);
    }, 1500);
  });
}

function fetchPostComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        const comments = [
        { commentId: 1, postId: 1, username: "user1", comment: "Aromatic" },
        { commentId: 2, postId: 2, username: "user1", comment: "Delicious" },
        { commentId: 3, postId: 3, username: "user1", comment: "Great Technique" },
        ];
        resolve(comments);
    }, 2000);
  });
}
