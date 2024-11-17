// analysis/page.tsx

"use client";

import AnalysisPlot from "@/components/elements/AnalysisPlot/AnalysisPlot";
import MainLayout from "@/components/layouts/mainLayout/mainLayout";
import { Box, Typography } from "@mui/material";

const Analysis = () => {
    return (
        <MainLayout>
            <Box>
                <Typography style={{ flexGrow: 1, fontSize: 25, fontWeight: "550" }}>
                    Analysis
                </Typography>
            </Box>
            <AnalysisPlot/>
        </MainLayout>
    )
};

export default Analysis;
