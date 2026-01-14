import {
  Alert,
  Box,
  CircularProgress,
  Chip,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  TableSortLabel,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { formatDateISO } from '../lib/format';
import { toggleSort } from '../lib/sort';

function StatusChip({ status }) {
  if (status === 'Решено') {
    return <Chip size="small" color="success" icon={<CheckCircleOutlineIcon />} label={status} />;
  }
  if (status === 'Отклонено') {
    return <Chip size="small" color="error" icon={<CancelOutlinedIcon />} label={status} />;
  }
  return <Chip size="small" color="warning" icon={<HourglassEmptyIcon />} label={status ?? ''} />;
}

export default function RequestsTable({
  loading,
  error,
  rows,
  page,
  totalPages,
  onPageChange,
  onRowClick,
  selectedId,
  sort,
  onSortChange,
}) {
  const skeletonRows = 8;

  function isSortedBy(key) {
    return sort?.key === key;
  }

  function handleSort(key) {
    const next = toggleSort(sort, key);
    onSortChange?.(next);
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        height: { xs: 'auto', lg: 640 },
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        transition: 'box-shadow 180ms ease, transform 180ms ease',
        '&:hover': { boxShadow: 3 },
      }}
    >
      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1">Таблица обращений</Typography>
        <Typography variant="caption" color="text.secondary">
          Клик по строке — подробности
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <CircularProgress size={18} />
              <Typography variant="body2">Загрузка данных…</Typography>
            </Box>

            <Table size="small" aria-label="loading requests table">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Категория</TableCell>
                  <TableCell>Адрес</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Дата регистрации</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.from({ length: skeletonRows }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <Skeleton width={32} />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={90} />
                    </TableCell>
                    <TableCell>
                      <Skeleton width={90} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">Не удалось загрузить данные: {String(error.message ?? error)}</Alert>
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Ничего не найдено по текущим фильтрам.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table stickyHeader size="small" aria-label="requests table" sx={{ '& td, & th': { py: 1 } }}>
              <TableHead>
                <TableRow>
                  <TableCell sortDirection={isSortedBy('id') ? sort.dir : false}>
                    <TableSortLabel
                      active={isSortedBy('id')}
                      direction={isSortedBy('id') ? sort.dir : 'asc'}
                      onClick={() => handleSort('id')}
                    >
                      ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={isSortedBy('category') ? sort.dir : false}>
                    <TableSortLabel
                      active={isSortedBy('category')}
                      direction={isSortedBy('category') ? sort.dir : 'asc'}
                      onClick={() => handleSort('category')}
                    >
                      Категория
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={isSortedBy('address') ? sort.dir : false}>
                    <TableSortLabel
                      active={isSortedBy('address')}
                      direction={isSortedBy('address') ? sort.dir : 'asc'}
                      onClick={() => handleSort('address')}
                    >
                      Адрес
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={isSortedBy('status') ? sort.dir : false}>
                    <TableSortLabel
                      active={isSortedBy('status')}
                      direction={isSortedBy('status') ? sort.dir : 'asc'}
                      onClick={() => handleSort('status')}
                    >
                      Статус
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={isSortedBy('created_at') ? sort.dir : false}>
                    <TableSortLabel
                      active={isSortedBy('created_at')}
                      direction={isSortedBy('created_at') ? sort.dir : 'asc'}
                      onClick={() => handleSort('created_at')}
                    >
                      Дата регистрации
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((r) => (
                  <TableRow
                    key={r.id}
                    hover
                    selected={selectedId != null && r.id === selectedId}
                    sx={(theme) => ({
                      cursor: 'pointer',
                      transition: 'background-color 150ms ease',
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.action.selected,
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: theme.palette.action.selected,
                      },
                    })}
                    onClick={() => onRowClick?.(r)}
                  >
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.category}</TableCell>
                    <TableCell>{r.address}</TableCell>
                    <TableCell>
                      <StatusChip status={r.status} />
                    </TableCell>
                    <TableCell>{formatDateISO(r.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Pagination
          size="small"
          count={totalPages}
          page={page}
          onChange={(_, next) => onPageChange?.(next)}
        />
      </Box>
    </Paper>
  );
}
