//---Part2---
//A-UserProfile
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
//B-UserPosts
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
//C-PostComments
function fetchPostComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        // Add random failure (30% chance of error)
        if (Math.random() < 0.3) {
            reject(new Error('Failed to fetch comments'));
            return;
        }
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
//D-Sequential
async function fetchDataSequentially(userId) {
    console.log('Starting sequential fetch...');
    const startTime = Date.now();
    //Variable declaration for error so it exists outisde the promise
    let user = null;
    let posts = [];
    let comments = [];

    try {
        user = await fetchUserProfile(userId)
        console.log("User profile retrieved");
        
        posts = await fetchUserPosts(userId)
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
        console.log('Something went wrong, returning partial data.');
    }
    return { user, posts, comments };
}
//E-Parallel
async function fetchDataInParallel(userId) {
    console.log('Starting parallel fetch...');
    const startTime = Date.now();
    //Variable declaration for error so it exists outisde the promise
    let user = null;
    let posts = [];
    let comments = [];    
    try {
        //Runs both promises simultaneiously
        [user, posts] = await Promise.all([
            fetchUserProfile(userId), fetchUserPosts(userId)
        ]);
        console.log('User and posts retrieved simultaneously');
        //Map each post to the corresponding comment fetching
        const commentsArrays = await Promise.all(
            posts.map(post => fetchPostComments(post.postId))
        );
        //Matching each comment with the postId
        comments = posts.map((post, index) => ({
            postId: post.postId,
            comments: commentsArrays[index]
        }));

        const endTime = Date.now();
        console.log(`Parallel fetch took ${endTime - startTime}ms`);

        return { user, posts, comments };
        
    } catch (error) {
        console.error('Error in parallel fetch:', error.message);
        console.log('Something went wrong, returning partial data.');
    }
    return { user, posts, comments };
}
//---Part5---
//H-Master Function
async function getUserContent(userId) {
  console.log('=== Fetching all user content ===');
  
  try {
    // Step 1: Fetch user profile
    const user = await fetchUserProfile(userId);
    console.log('Step 1: User profile retrieved -', user.name);
    // Step 2: Fetch user's posts
    const posts = await fetchUserPosts(userId);
    console.log('Step 2: Posts retrieved -', posts.length);
    // Step 3: Fetch comments for all posts
    const comments = [];
    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const postComments = await fetchPostComments(post.postId);
        comments.push({ postId: post.postId, comments: postComments });
    }
    console.log('Step 3: Comments retrieved');
    // Step 4: Combine all data into one object
    const allContent = {
        user: user,          
        posts: posts,       
        comments: comments, 
    };
    return allContent;
  } catch (error) {
    console.error('Failed to fetch user content:', error.message);
    throw error;
  }
}
//---Part6---
//I-Connect html buttons
document.getElementById('sequentialBtn').addEventListener('click', async () => {
  const output = document.getElementById('output');
  output.innerHTML = 'Loading sequential data...';
  const data = await fetchDataSequentially(1);
  displayResults(data, output);
});
document.getElementById('parallelBtn').addEventListener('click', async () => {
  const output = document.getElementById('output');
  output.innerHTML = 'Loading parallel data...';
  const data = await fetchDataInParallel(1);
  displayResults(data, output);
});
//J-Display function
function displayResults(data, container) {
    //Clear Previous Content
    container.innerHTML = '';
    //Display user info
    container.innerHTML += 'User: ' + data.user.name + '<br><br>';
    container.innerHTML += 'User Name: ' + data.user.username +'<br><br>';
    container.innerHTML += 'Email: ' + data.user.email + '<br><br>';
    //Display Posts and Comments
    for (let i = 0; i < data.posts.length; i++) {
        const post = data.posts[i];
        container.innerHTML += 'Post: ' + post.title + '<br>';
        container.innerHTML += 'Content: ' + post.content + '<br>';

        const postComments = data.comments[i].comments; 
        for (let j = 0; j < postComments.length; j++) {
            const comment = postComments[j];
            container.innerHTML += comment.username + ': ' + comment.comment + '<br>';
        }
        container.innerHTML += '<br>';
    }
}



