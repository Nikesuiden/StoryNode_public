"use client";

import { createClient } from "@/utils/supabase/client";
import { Box, CircularProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DiaryPost {
  id: number;
  content: string;
  emotion: string;
  createdAt: string;
}

// 感情に基づいたスコアを定義
const emotionScores: Record<string, number> = {
  grad: 1,
  Funny: 1,
  expectations: 1,
  happy: 1,
  surprise: 1,
  sad: -1,
  angry: -1,
  anxiety: -1,
  painful: -1,
};

const AnalysisChart = () => {
  const [diaryData, setDiaryData] = useState<DiaryPost[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const fetchDiaryPosts = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();
    if (!data || error) {
      alert("情報の取得に失敗しました。");
      return;
    }

    const response = await fetch("/api/diaryPost", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.session?.access_token}`,
      },
    });

    if (response.ok) {
      const diaryPostData: DiaryPost[] = await response.json();
      setDiaryData(diaryPostData);
    } else {
      handleNavigation("/signin");
    }
  };

  // 感情分析機能
  const calculateEmotionScores = (posts: DiaryPost[]) => {
    const today = dayjs();
  
    // 過去7日間の日付を取得
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      today.subtract(i, "day").format("MM/DD")
    ).reverse();
  
    // 各日の感情スコアを計算
    const scores = last7Days.map((date) => {
      const dailyPosts = posts.filter(
        (post) => dayjs(post.createdAt).format("MM/DD") === date
      );
  
      const dailyScore = dailyPosts.reduce((sum, post) => {
        return sum + (emotionScores[post.emotion] || 0);
      }, 0);
      return { date, score: dailyScore };
    });
  
    // 縦軸のスケールを設定
    const maxScore = Math.max(...scores.map((item) => item.score), 0);
    const minScore = Math.min(...scores.map((item) => item.score), 0);
    const axisLimit = Math.max(Math.abs(maxScore), Math.abs(minScore));
  
    setChartData({
      labels: scores.map((item) => item.date),
      datasets: [
        {
          label: "感情の起伏",
          data: scores.map((item) => item.score),
          borderColor: "lightblue",
          backgroundColor: "lightblue",
          tension: 0.3,
        },
      ],
      options: {
        scales: {
          y: {
            min: -axisLimit, // 最低値を設定
            max: axisLimit, // 最大値を設定
            ticks: {
              stepSize: 1,
            },
            grid: {
              drawBorder: true,
              color: (context: any) => {
                // y=0 の横線を黒色に、それ以外を薄灰色に
                return Number(context.tick.value) === 0 ? "black" : "lightgray";
              },
              lineWidth: (context: any) => {
                // y=0 の横線を太くする
                return Number(context.tick.value) === 0 ? 2 : 1;
              },
            },
          },
        },
      },
    });
  };
  

  useEffect(() => {
    fetchDiaryPosts();
  }, []);

  useEffect(() => {
    if (diaryData.length > 0) {
      calculateEmotionScores(diaryData);
    }


  }, [diaryData]);

  return (
    <Box>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "過去7日間の感情スコア" },
            },
            scales: {
              y: {
                min: chartData.options.scales.y.min,
                max: chartData.options.scales.y.max,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          }}
        />
      ) : (
        <Box
          sx={{
            m: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 20,
          }}
        >
          <CircularProgress size={50}/>
        </Box>
      )}
    </Box>
  );
};

export default AnalysisChart;
