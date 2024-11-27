"use client";

import { createClient } from "@/utils/supabase/client";
import { Box, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import LoadingProgress from "../loadingProgress/loadingProgress";
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement, // 棒グラフ用の要素を登録
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
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

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

  // 感情スコアと投稿数を計算
  const calculateEmotionAndPostData = (posts: DiaryPost[]) => {
    const today = dayjs();

    // 過去7日間の日付を取得
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      today.subtract(i, "day").format("MM/DD")
    ).reverse();

    // 各日の感情スコアと投稿数を計算
    const data = last7Days.map((date) => {
      const dailyPosts = posts.filter(
        (post) => dayjs(post.createdAt).format("MM/DD") === date
      );

      // 各日の感情スコアを計算（平均スコア）
      const totalScore = dailyPosts.reduce(
        (sum, post) => sum + (emotionScores[post.emotion] || 0),
        0
      );
      const averageScore =
        dailyPosts.length > 0 ? totalScore / dailyPosts.length : 0;

      return {
        date,
        averageScore,
        postCount: dailyPosts.length, // 投稿数
      };
    });

    setChartData({
      labels: data.map((item) => item.date),
      datasets: [
        {
          type: "line", // 折れ線グラフ
          label: "感情の平均スコア",
          data: data.map((item) => item.averageScore),
          borderColor: "lightblue",
          backgroundColor: "lightblue",
          yAxisID: "y", // 左側のy軸に紐付け
          tension: 0.3,
          fill: false,
        },
        // {
        //   type: "bar", // 棒グラフ
        //   label: "日記の投稿数",
        //   data: data.map((item) => item.postCount),
        //   backgroundColor: "#FFFDD0",
        //   yAxisID: "y2", // 右側のy軸に紐付け
        // },
      ],
    });
  };

  useEffect(() => {
    fetchDiaryPosts();
  }, []);

  useEffect(() => {
    if (diaryData.length > 0) {
      calculateEmotionAndPostData(diaryData);
    }
  }, [diaryData]);

  return (
    <Box>
      {chartData.labels.length > 0 ? (
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
                type: "linear",
                position: "left", // 左側のy軸
                min: -1, // y軸の最小値を-1に設定
                max: 1, // y軸の最大値を+1に設定
                title: {
                  display: true,
                  text: "感情スコア",
                },
                ticks: {
                  stepSize: 0.5, // ステップサイズを調整
                },
                grid: {
                  color: () => "lightgrey",
                  lineWidth: (context: any) => {
                    return Number(context.tick.value) === 0 ? 2.5 : 1;
                  },
                },
              },
              // y2: {
              //   type: "linear",
              //   position: "right", // 右側のy軸
              //   min: 0, // 投稿数は0以上なので最小値を0に設定
              //   // maxは自動調整
              //   title: {
              //     display: true,
              //     text: "投稿数",
              //   },
              //   ticks: {
              //     stepSize: 1, // 必要に応じて調整
              //   },
              //   grid: {
              //     drawOnChartArea: false, // 右側y軸のグリッドを非表示
              //   },
              // },
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
            flexDirection: "column",
          }}
        >
          <LoadingProgress />
          <Typography sx={{ mt: 2, display: "none" }}>読み込み中...</Typography>
        </Box>
      )}
    </Box>
  );
};

export default AnalysisChart;
