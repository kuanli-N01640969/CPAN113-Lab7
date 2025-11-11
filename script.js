//---Part2---
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
        { commentId: 2, postId: 2, username: "user2", comment: "Delicious" },
        { commentId: 3, postId: 3, username: "user3", comment: "Great Technique" },
        ];
        resolve(comments);
    }, 2000);
  });
}
//---Part3---
//Sequential
async function fetchDataSequentially(userId) {
  console.log('Starting sequential fetch...');
  const startTime = Date.now();
  
  try {
    const user = await fetchUserProfile(userId)
    console.log("User profile retrieved");
    
    const posts = await fetchUserPosts(userId)
    console.log("Posts retrieved");
    //Create empty array so the loop can store the fetched comments 
    const comments = [];
    for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const postComments = await fetchPostComments(post.postId);
    comments.push({ postId: post.postId, comments: postComments });
    console.log(`Comments retrieved for post ${post.postId}`);
    }

    const endTime = Date.now();
    console.log(`Sequential fetch took ${endTime - startTime}ms`);
    
    return { user, posts, comments };

  } catch (error) {
    console.error('Error in sequential fetch:', error.message);
  }
}
//Parallel
async function fetchDataInParallel(userId) {
  console.log('Starting parallel fetch...');
  const startTime = Date.now();
  
  try {
    //Runs both promises simultaneiously
    const [user, posts] = await Promise.all([
        fetchUserProfile(userId), fetchUserPosts(userId)
    ]);
    
    console.log('User and posts retrieved simultaneously');
    //Map each post to the corresponding comment fetching
    const commentsArrays = await Promise.all(
        posts.map(post => fetchPostComments(post.postId))
    );
    //Matching each comment with the postId
    const comments = posts.map((post, index) => ({
        postId: post.postId,
        comments: commentsArrays[index]
    }));

    const endTime = Date.now();
    console.log(`Parallel fetch took ${endTime - startTime}ms`);

    return { user, posts, comments };
    
  } catch (error) {
    console.error('Error in parallel fetch:', error.message);
  }
}

