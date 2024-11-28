// analysis/page.tsx

"use client";

import AnalysisChart from "@/components/elements/AnalysisChart/AnalysisChart";
import MainLayout from "@/components/layouts/mainLayout/mainLayout";
import { Box, Typography } from "@mui/material";

const Analysis = () => {
    return (
        <MainLayout>
            <Box>
                <Typography sx={{ flexGrow: 1, fontSize: 25, fontWeight: "550" }}>
                    Analysis
                </Typography>
            </Box>
            <AnalysisChart/>
        </MainLayout>
    )
};

export default Analysis;
