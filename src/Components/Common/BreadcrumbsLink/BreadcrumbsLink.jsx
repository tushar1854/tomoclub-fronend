import * as React from 'react';
import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Stack } from '@mui/material';

export default function BreadcrumbsLink({ breadcrumbValues, lastValue }) {
  return (
    <Stack spacing={2}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {Object.keys(breadcrumbValues).map((key) => (
          <Link underline="hover" key={key} color="inherit" href={breadcrumbValues[key].link}>
            {breadcrumbValues[key].name}
          </Link>
        ))}
        <Typography key="3" fontSize={'14px'} color="text.primary">
          {lastValue}
        </Typography>
      </Breadcrumbs>
    </Stack>
  );
}
