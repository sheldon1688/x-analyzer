import React, { useState } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Box,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import axios from 'axios';

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

interface Progress {
  step: string;
  progress: number;
}

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<Progress>({ step: '', progress: 0 });

  const handleAnalyze = async () => {
    if (!username) {
      setError('请输入X账号');
      return;
    }

    setLoading(true);
    setError('');
    setProgress({ step: '正在访问账号主页...', progress: 10 });
    
    try {
      // 这里将调用后端API
      const response = await axios.post('/api/analyze', { username }, {
        onDownloadProgress: (progressEvent) => {
          const total = progressEvent.total || 100;
          const current = progressEvent.loaded;
          const progress = Math.round((current / total) * 100);
          
          if (progress < 30) {
            setProgress({ step: '正在访问账号主页...', progress });
          } else if (progress < 60) {
            setProgress({ step: '正在加载帖子内容...', progress });
          } else if (progress < 90) {
            setProgress({ step: '正在分析数据...', progress });
          } else {
            setProgress({ step: '正在生成报告...', progress });
          }
        }
      });
      
      setResult(response.data);
      setProgress({ step: '分析完成！', progress: 100 });
    } catch (err) {
      setError('分析失败，请稍后重试');
      setProgress({ step: '分析失败', progress: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          X账号分析工具
        </Typography>
        
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="X账号"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入X账号（不需要@符号）"
            />
            <Button
              variant="contained"
              onClick={handleAnalyze}
              disabled={loading}
              sx={{ minWidth: '120px' }}
            >
              {loading ? <CircularProgress size={24} /> : '开始分析'}
            </Button>
          </Box>
          
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {loading && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {progress.step}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress.progress}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography variant="body2" align="right" sx={{ mt: 1 }}>
                {progress.progress}%
              </Typography>
            </Box>
          )}
        </Paper>

        {result && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              分析结果
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <Typography>注册时间：{result.registrationDate}</Typography>
              <Typography>近一个月发帖数：{result.postsLastMonth}</Typography>
              <Typography>平均浏览量：{result.averageViews}</Typography>
              <Typography>平均点赞数：{result.averageLikes}</Typography>
              <Typography>平均评论数：{result.averageComments}</Typography>
              <Typography>平均转发数：{result.averageRetweets}</Typography>
              <Typography>互动率：{result.engagementRate}%</Typography>
              <Typography>曝光互动率：{result.viewEngagementRate}%</Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default App;
