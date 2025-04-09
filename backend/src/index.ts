import { ExecutionContext } from '@cloudflare/workers-types';

interface Env {
  // 可以在这里添加环境变量
}

interface AnalysisResult {
  registrationDate: string;
  postsLastMonth: number;
  averageViews: number;
  averageLikes: number;
  averageComments: number;
  averageRetweets: number;
  engagementRate: number;
  viewEngagementRate: number;
}

interface PostData {
  views: number;
  likes: number;
  comments: number;
  retweets: number;
  timestamp: string;
}

// 模拟用户行为的延迟函数
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟滚动行为
const simulateScroll = async () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollStep = 100;
  const scrollDelay = 1000; // 1秒滚动一次
  
  for (let i = 0; i < scrollHeight; i += scrollStep) {
    window.scrollTo(0, i);
    await sleep(scrollDelay);
  }
};

// 获取帖子数据
const getPostData = async (postElement: Element): Promise<PostData> => {
  // 模拟用户查看帖子的行为
  await sleep(500 + Math.random() * 1000);
  
  const views = postElement.querySelector('[data-testid="app-text-transition-container"]')?.textContent || '0';
  const likes = postElement.querySelector('[data-testid="like"]')?.textContent || '0';
  const comments = postElement.querySelector('[data-testid="reply"]')?.textContent || '0';
  const retweets = postElement.querySelector('[data-testid="retweet"]')?.textContent || '0';
  const timestamp = postElement.querySelector('time')?.getAttribute('datetime') || new Date().toISOString();
  
  return {
    views: parseInt(views.replace(/,/g, '')) || 0,
    likes: parseInt(likes.replace(/,/g, '')) || 0,
    comments: parseInt(comments.replace(/,/g, '')) || 0,
    retweets: parseInt(retweets.replace(/,/g, '')) || 0,
    timestamp,
  };
};

// 分析账号数据
const analyzeAccount = async (username: string): Promise<AnalysisResult> => {
  try {
    // 访问用户主页
    window.location.href = `https://twitter.com/${username}`;
    await sleep(2000 + Math.random() * 1000);
    
    // 获取注册时间
    const joinDate = document.querySelector('[data-testid="UserJoinDate"]')?.textContent || '';
    const registrationDate = joinDate.split('加入于')[1]?.trim() || '';
    
    // 模拟滚动加载更多内容
    await simulateScroll();
    
    // 获取帖子数据
    const posts = document.querySelectorAll('[data-testid="tweet"]');
    const postData: PostData[] = [];
    
    for (const post of posts) {
      const data = await getPostData(post);
      postData.push(data);
    }
    
    // 计算统计数据
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const recentPosts = postData.filter(post => {
      const postDate = new Date(post.timestamp);
      return postDate > oneMonthAgo;
    });
    
    const totalViews = postData.reduce((sum, post) => sum + post.views, 0);
    const totalLikes = postData.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = postData.reduce((sum, post) => sum + post.comments, 0);
    const totalRetweets = postData.reduce((sum, post) => sum + post.retweets, 0);
    
    const result: AnalysisResult = {
      registrationDate,
      postsLastMonth: recentPosts.length,
      averageViews: Math.round(totalViews / postData.length),
      averageLikes: Math.round(totalLikes / postData.length),
      averageComments: Math.round(totalComments / postData.length),
      averageRetweets: Math.round(totalRetweets / postData.length),
      engagementRate: Math.round((totalLikes + totalComments + totalRetweets) / postData.length * 100) / 100,
      viewEngagementRate: Math.round((totalLikes + totalComments + totalRetweets) / totalViews * 100) / 100,
    };
    
    return result;
  } catch (error) {
    console.error('分析失败:', error);
    throw error;
  }
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // 处理CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 处理API请求
    if (request.method === 'POST' && new URL(request.url).pathname === '/api/analyze') {
      try {
        const { username } = await request.json();
        const result = await analyzeAccount(username);
        
        return new Response(JSON.stringify(result), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: '分析失败' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // 处理静态文件请求
    return new Response('Not Found', { status: 404 });
  },
}; 