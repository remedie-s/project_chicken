import { Grid2 } from '@mui/material';
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const ResponsiveGrid = ({ children }: any) => {
    return (
        <Grid2 container spacing={2}>
            {React.Children.map(children, (child) => (
                // @ts-ignore
                <Grid2 item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            {child}
                        </CardContent>
                    </Card>
                </Grid2>
            ))}
        </Grid2>
    );
};

export default ResponsiveGrid;