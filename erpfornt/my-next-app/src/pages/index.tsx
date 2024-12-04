import ResponsiveGrid from "@/layout/ResponsiveGrid";
import Dashboard from "../layout/Dashboard";
import { AppProvider, PageContainer } from "@toolpad/core";
import { Box, Typography } from "@mui/material";

const Main = () => {
    return (
        <div>
            <Dashboard>
                <ResponsiveGrid>
                    <Box>
                        <br />
                        <Typography
                            variant="h4"
                            sx={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                            ERP 사이트 입니다
                        </Typography>
                    </Box>


                </ResponsiveGrid>
            </Dashboard>
        </div>
    );
};

export default Main;