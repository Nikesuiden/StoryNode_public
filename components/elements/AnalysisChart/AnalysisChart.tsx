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

    // lengthで取得日数を選択する。
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      today.subtract(i, "day").format("MM/DD")
    ).reverse(); // 配列を逆順にして、最新の日付が右に来るように設定 .reverse

    // map (Pythonで言うところのfor) を展開して1日ごとの感情スコアを計測する。
    const scores = last7Days.map((date) => {

      // createAtから月と日の数値を取って表の日にちパラメータを生成
      const dailyPosts = posts.filter(
        (post) => dayjs(post.createdAt).format("MM/DD") === date
      );

      // スコアを計算する
      const dailyScore = dailyPosts.reduce((sum, post) => {
        return sum + (emotionScores[post.emotion] || 0);
      }, 0);
      return { date, score: dailyScore };
    });

    // 最大値と最小値を取得し、縦軸のスケールを設定
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
            min: -axisLimit, // グラフを線対象にするため 最低値を指定
            max: axisLimit, // 同様の理由で 最大値を設定
            ticks: {
              stepSize: 1,
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
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default AnalysisChart;
